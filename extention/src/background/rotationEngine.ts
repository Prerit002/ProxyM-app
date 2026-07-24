import type { AppSettings } from "@/types/settings.types";
import type { ProxyEntry } from "@/types/proxy.types";
import { ROTATION_ALARM_NAME } from "@/utils/constants";
import { applyProxy } from "./proxyEngine";
import { loadSettings, saveSettings } from "@/services/storageService";

/** Schedules (or reschedules) the rotation alarm. */
export function scheduleRotation(intervalMinutes: number): void {
  chrome.alarms.clear(ROTATION_ALARM_NAME, () => {
    chrome.alarms.create(ROTATION_ALARM_NAME, {
      delayInMinutes: intervalMinutes,
      periodInMinutes: intervalMinutes,
    });
  });
}

export function cancelRotation(): void {
  chrome.alarms.clear(ROTATION_ALARM_NAME);
}

// ── Pick next proxy based on rotation mode ───────────────────────────────────

function pickNext(settings: AppSettings): ProxyEntry | null {
  const { proxies, activeProxyId, rotation, autoDetect } = settings;
  if (!proxies.length) return null;

  // Filter out proxies we should skip
  let pool = proxies.filter((p) => {
    if (!autoDetect.autoSkipFlagged) return true;
    const s = p.testResult?.status;
    if (!s || s === "untested" || s === "ok") return true;
    if (s === "dead" || s === "blocked") return false;
    if (s === "slow"    && !rotation.skipFailed) return true;
    if (s === "expired" && !rotation.skipFailed) return true;
    return rotation.skipFailed ? false : true;
  });

  // Enforce cooldown
  if (rotation.cooldownMinutes > 0) {
    const cutoff = Date.now() - rotation.cooldownMinutes * 60_000;
    const cooled = pool.filter((p) => !p.lastUsed || p.lastUsed < cutoff);
    
    // Only apply the cooldown filter if it leaves us with at least one OTHER proxy to switch to.
    // Otherwise, the cooldown is too strict for the number of proxies we have, so we ignore it.
    if (cooled.some(p => p.id !== activeProxyId)) {
      pool = cooled;
    }
  }

  if (!pool.length) pool = proxies; // fallback: use all

  const current = pool.findIndex((p) => p.id === activeProxyId);

  switch (rotation.mode) {
    case "round-robin":
      return pool[(current + 1) % pool.length];

    case "random": {
      const candidates = pool.filter((p) => p.id !== activeProxyId);
      const src = candidates.length ? candidates : pool;
      return src[Math.floor(Math.random() * src.length)];
    }

    case "weighted": {
      const totalWeight = pool.reduce((s, p) => s + (p.weight ?? 1), 0);
      let r = Math.random() * totalWeight;
      for (const p of pool) {
        r -= p.weight ?? 1;
        if (r <= 0) return p;
      }
      return pool[0];
    }

    case "sticky": {
      // Stay on current if within sticky window
      const current = proxies.find((p) => p.id === activeProxyId);
      if (current?.lastUsed) {
        const elapsed = Date.now() - current.lastUsed;
        if (elapsed < rotation.stickySessionMinutes * 60_000) return current;
      }
      return pool[0];
    }

    default:
      return pool[(current + 1) % pool.length];
  }
}

// ── Main rotate function ─────────────────────────────────────────────────────

export async function rotateProxy(): Promise<void> {
  const settings = await loadSettings();
  if (!settings.enabled || !settings.proxies.length) return;

  const next = pickNext(settings);
  if (!next || next.id === settings.activeProxyId) return;

  // Stamp lastUsed on the proxy being rotated away from
  const updated: AppSettings = {
    ...settings,
    activeProxyId: next.id,
    proxies: settings.proxies.map((p) =>
      p.id === settings.activeProxyId ? { ...p, lastUsed: Date.now() } : p
    ),
  };

  await saveSettings(updated);
  await applyProxy(updated);
}
