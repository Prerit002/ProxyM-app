import { loadSettings } from "@/services/storageService";
import { STORAGE_KEY } from "@/utils/constants";
import type { ProxyEntry } from "@/types/proxy.types";

let activeProxyCache: ProxyEntry | null = null;
let cachePromise: Promise<void> | null = null;

async function fetchAndCache() {
  const settings = await loadSettings();
  if (settings.enabled && settings.activeProxyId) {
    activeProxyCache = settings.proxies.find((p) => p.id === settings.activeProxyId) || null;
  } else {
    activeProxyCache = null;
  }
}

function ensureCache(): Promise<void> {
  if (!cachePromise) {
    cachePromise = fetchAndCache();
  }
  return cachePromise;
}

// Start loading immediately when service worker starts
ensureCache();

// Keep cache in sync with storage changes
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
      cachePromise = fetchAndCache();
    }
  });
}

/**
 * Registers the webRequest auth handler for proxies that require credentials.
 */
export function registerAuthHandler(): void {
  if (
    typeof chrome === "undefined" ||
    typeof chrome.webRequest === "undefined" ||
    typeof chrome.webRequest.onAuthRequired === "undefined"
  ) {
    return;
  }

  // We use asyncBlocking. If the cache is already loaded, ensureCache() resolves instantly.
  // If it's the very first request and the cache is still loading, it waits for the promise to resolve,
  // preventing Chrome from showing the prompt because activeProxyCache was temporarily null.
  chrome.webRequest.onAuthRequired.addListener(
    (details, callback) => {
      ensureCache().then(() => {
        if (details.isProxy && activeProxyCache?.username && activeProxyCache?.password) {
          callback?.({
            authCredentials: {
              username: activeProxyCache.username,
              password: activeProxyCache.password,
            },
          });
        } else {
          callback?.({});
        }
      });
    },
    { urls: ["<all_urls>"] },
    ["asyncBlocking"]
  );
}
