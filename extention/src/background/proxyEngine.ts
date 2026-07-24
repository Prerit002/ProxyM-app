import type { AppSettings } from "@/types/settings.types";
import type { ProxyEntry } from "@/types/proxy.types";

/**
 * Applies a proxy configuration to Chrome using chrome.proxy API.
 * If settings.enabled is false, clears the proxy (direct connection).
 */
export async function applyProxy(settings: AppSettings): Promise<void> {
  if (!settings.enabled || !settings.activeProxyId || settings.proxies.length === 0) {
    return clearProxy();
  }

  const proxy = settings.proxies.find((p) => p.id === settings.activeProxyId);
  if (!proxy) return clearProxy();

  const config = buildProxyConfig(proxy, settings.bypassRules.map((r) => r.pattern));

  return new Promise((resolve, reject) => {
    chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });
}

export async function clearProxy(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.clear({ scope: "regular" }, () => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve();
    });
  });
}

function buildProxyConfig(
  proxy: ProxyEntry,
  bypassList: string[]
): chrome.proxy.ProxyConfig {
  const scheme = mapScheme(proxy.protocol);

  const singleProxy: chrome.proxy.ProxyServer = {
    scheme,
    host: proxy.host,
    port: proxy.port,
  };

  return {
    mode: "fixed_servers",
    rules: {
      singleProxy,
      bypassList: bypassList.length > 0 ? bypassList : undefined,
    },
  };
}

function mapScheme(
  protocol: ProxyEntry["protocol"]
): chrome.proxy.ProxyServer["scheme"] {
  switch (protocol) {
    case "http":   return "http";
    case "https":  return "https";
    case "socks4": return "socks4";
    case "socks5": return "socks5";
  }
}
