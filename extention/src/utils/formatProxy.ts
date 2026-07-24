import type { ProxyEntry } from "@/types/proxy.types";

/** Returns a display-safe string (password masked) */
export function formatProxyDisplay(proxy: ProxyEntry): string {
  const auth =
    proxy.username
      ? proxy.password
        ? `${proxy.username}:****@`
        : `${proxy.username}@`
      : "";
  return `${proxy.protocol}://${auth}${proxy.host}:${proxy.port}`;
}

/** Returns host:port label for status bar */
export function formatProxyShort(proxy: ProxyEntry): string {
  return `${proxy.host}:${proxy.port}`;
}
