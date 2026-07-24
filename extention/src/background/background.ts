import { loadSettings, saveSettings } from "@/services/storageService";
import { applyProxy, clearProxy } from "./proxyEngine";
import { scheduleRotation, cancelRotation, rotateProxy } from "./rotationEngine";
import { registerAuthHandler } from "./authHandler";
import { testProxy } from "./testEngine";
import { ROTATION_ALARM_NAME } from "@/utils/constants";
import type {
  Message, MessageResponse, SaveSettingsPayload,
  FetchGeoPayload, GeoData, TestProxyPayload,
} from "@/types/message.types";
import type { AppSettings } from "@/types/settings.types";
import { DEFAULT_ROTATION, DEFAULT_AUTO_DETECT } from "@/types/settings.types";

// ── Startup ──────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  console.log("[ProxyM] Extension installed.");
  const settings = await loadSettings();
  if (settings.enabled) {
    await applyProxy(settings);
    scheduleRotation(settings.rotationIntervalMinutes);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const settings = await loadSettings();
  if (settings.enabled) {
    await applyProxy(settings);
    scheduleRotation(settings.rotationIntervalMinutes);
  }
});

registerAuthHandler();

// ── Alarm (rotation) ─────────────────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ROTATION_ALARM_NAME) {
    await rotateProxy();
  }
});

// ── Message handler ───────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    handleMessage(message, sendResponse);
    return true; // keep the channel open for async responses
  }
);

async function handleMessage(
  message: Message,
  sendResponse: (response: MessageResponse) => void
): Promise<void> {
  try {
    switch (message.type) {
      case "GET_SETTINGS": {
        const settings = await loadSettings();
        sendResponse({ success: true, data: settings });
        break;
      }

      case "SAVE_SETTINGS": {
        const { settings } = message.payload as SaveSettingsPayload;
        // Ensure new config fields have defaults for old installs
        const merged: AppSettings = {
          ...settings,
          rotation:    { ...DEFAULT_ROTATION,     ...(settings.rotation    ?? {}) },
          autoDetect:  { ...DEFAULT_AUTO_DETECT,  ...(settings.autoDetect  ?? {}) },
        };
        await saveSettings(merged);

        if (merged.enabled && merged.proxies.length > 0) {
          const withActive: AppSettings = !merged.activeProxyId
            ? { ...merged, activeProxyId: merged.proxies[0].id }
            : merged;
          if (!merged.activeProxyId) await saveSettings(withActive);
          await applyProxy(withActive);
          scheduleRotation(withActive.rotation?.intervalMinutes ?? withActive.rotationIntervalMinutes);
        } else {
          await clearProxy();
          cancelRotation();
        }
        sendResponse({ success: true });
        break;
      }

      case "ROTATE_NOW": {
        await rotateProxy();
        const updated = await loadSettings();
        sendResponse({ success: true, data: updated });
        break;
      }

      case "CLEAR_PROXY": {
        await clearProxy();
        cancelRotation();
        sendResponse({ success: true });
        break;
      }

      case "FETCH_GEO": {
        const { host } = message.payload as FetchGeoPayload;
        const geo = await fetchGeoInfo(host);
        sendResponse({ success: true, data: geo });
        break;
      }

      case "TEST_PROXY": {
        const { proxyId } = message.payload as TestProxyPayload;
        const s = await loadSettings();
        const proxy = s.proxies.find((p) => p.id === proxyId);
        if (!proxy) { sendResponse({ success: false, error: "Proxy not found" }); break; }

        const result = await testProxy(proxy);

        // Persist result into the proxy entry
        const updated: AppSettings = {
          ...s,
          proxies: s.proxies.map((p) => p.id === proxyId ? { ...p, testResult: result } : p),
        };
        await saveSettings(updated);
        sendResponse({ success: true, data: { proxyId, result } });
        break;
      }

      case "TEST_ALL_PROXIES":
      case "AUTO_DETECT_ALL": {
        const s = await loadSettings();
        const results: Record<string, unknown> = {};

        await Promise.all(
          s.proxies.map(async (proxy) => {
            const result = await testProxy(proxy);
            results[proxy.id] = result;
          })
        );

        const updated: AppSettings = {
          ...s,
          proxies: s.proxies.map((p) => ({
            ...p,
            testResult: results[p.id] as AppSettings["proxies"][0]["testResult"],
          })),
        };
        await saveSettings(updated);
        sendResponse({ success: true, data: results });
        break;
      }

      default:
        sendResponse({ success: false, error: `Unknown message type: ${message.type}` });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ProxyM] Error handling message:", msg);
    sendResponse({ success: false, error: msg });
  }
}

// ── Geo lookup (runs in service worker — no CORS restrictions) ────────────────

async function fetchGeoInfo(host: string): Promise<GeoData> {
  // Try HTTPS-only APIs in order — service worker has no CORS/mixed-content issues
  const apis = [
    () => fetchFromIpWho(host),
    () => fetchFromIpGuide(host),
    () => fetchFromFreeIpApi(host),
  ];

  let lastErr = "All geo APIs failed";
  for (const api of apis) {
    try {
      return await api();
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      console.warn("[ProxyM] Geo API failed, trying next:", lastErr);
    }
  }
  throw new Error(lastErr);
}

/** ipwho.is — free HTTPS, supports domain + IP, no key needed */
async function fetchFromIpWho(host: string): Promise<GeoData> {
  const res = await fetch(
    `https://ipwho.is/${encodeURIComponent(host)}`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!res.ok) throw new Error(`ipwho.is HTTP ${res.status}`);
  const d = await res.json();
  if (d.success === false) throw new Error(d.message ?? "ipwho.is lookup failed");
  return {
    ip:          d.ip             ?? host,
    country:     d.country        ?? "Unknown",
    countryCode: d.country_code   ?? "",
    city:        d.city           ?? "Unknown",
    region:      d.region         ?? "",
    isp:         d.connection?.isp ?? d.connection?.org ?? "Unknown",
    timezone:    d.timezone?.id   ?? "Unknown",
  };
}

/** ip.guide — free HTTPS, clean JSON, no key needed */
async function fetchFromIpGuide(host: string): Promise<GeoData> {
  const res = await fetch(
    `https://ip.guide/${encodeURIComponent(host)}`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!res.ok) throw new Error(`ip.guide HTTP ${res.status}`);
  const d = await res.json();
  const loc = d.location ?? {};
  const net = d.network  ?? {};
  return {
    ip:          d.ip                     ?? host,
    country:     loc.country_name         ?? "Unknown",
    countryCode: loc.country              ?? "",
    city:        loc.city                 ?? "Unknown",
    region:      loc.state                ?? "",
    isp:         net.autonomous_system?.organization ?? "Unknown",
    timezone:    loc.timezone             ?? "Unknown",
  };
}

/** freeipapi.com — free HTTPS fallback, IP/domain, no key needed */
async function fetchFromFreeIpApi(host: string): Promise<GeoData> {
  const res = await fetch(
    `https://freeipapi.com/api/json/${encodeURIComponent(host)}`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!res.ok) throw new Error(`freeipapi HTTP ${res.status}`);
  const d = await res.json();
  return {
    ip:          d.ipAddress   ?? host,
    country:     d.countryName ?? "Unknown",
    countryCode: d.countryCode ?? "",
    city:        d.cityName    ?? "Unknown",
    region:      d.regionName  ?? "",
    isp:         "Unknown",
    timezone:    d.timeZone    ?? "Unknown",
  };
}
