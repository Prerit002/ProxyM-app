import type { ProxyEntry, ProxyProtocol } from "@/types/proxy.types";
import { SUPPORTED_PROTOCOLS } from "./constants";

export function generateProxyId(): string {
  return `proxy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─────────────────────────────────────────────────────────────
// Low-level helpers
// ─────────────────────────────────────────────────────────────

function assertProtocol(p: string): ProxyProtocol {
  const lp = p.toLowerCase();
  if ((SUPPORTED_PROTOCOLS as readonly string[]).includes(lp)) return lp as ProxyProtocol;
  throw new Error(`Unsupported protocol "${p}". Use: http, https, socks4, socks5`);
}

function parsePort(s: string): number {
  const n = parseInt(s, 10);
  if (isNaN(n) || n < 1 || n > 65535) throw new Error(`Invalid port "${s}". Must be 1–65535.`);
  return n;
}

function splitHostPort(hostPort: string): { host: string; port: number } {
  if (hostPort.startsWith("[")) {
    // IPv6  [::1]:port
    const cb = hostPort.indexOf("]");
    if (cb === -1) throw new Error("Invalid IPv6 address — missing closing bracket.");
    const host = hostPort.slice(1, cb);
    const after = hostPort.slice(cb + 1);
    if (!after.startsWith(":")) throw new Error("Missing port after IPv6 address.");
    return { host, port: parsePort(after.slice(1)) };
  }
  const ci = hostPort.lastIndexOf(":");
  if (ci === -1) throw new Error(`Missing port in "${hostPort}". Use host:port.`);
  const host = hostPort.slice(0, ci);
  if (!host) throw new Error("Host cannot be empty.");
  return { host, port: parsePort(hostPort.slice(ci + 1)) };
}

function makeEntry(
  protocol: ProxyProtocol,
  host: string,
  port: number,
  username?: string,
  password?: string,
  raw?: string
): ProxyEntry {
  return {
    id: generateProxyId(),
    protocol,
    host,
    port,
    username: username || undefined,
    password: password || undefined,
    raw: raw ?? `${protocol}://${username ? `${username}:${password ?? ""}@` : ""}${host}:${port}`,
    addedAt: Date.now(),
  };
}

// ─────────────────────────────────────────────────────────────
// Format detectors
// ─────────────────────────────────────────────────────────────

/** true when string starts with a known scheme:// */
function hasScheme(s: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(s);
}

/** Detect "host:port:user:pass" (colon-separated, exactly 4 parts, port is numeric) */
function isColonQuad(s: string): boolean {
  const parts = s.split(":");
  if (parts.length !== 4) return false;
  const port = parseInt(parts[1], 10);
  return !isNaN(port) && port > 0 && port < 65536;
}

/** Detect "user:pass@host:port" — has @ sign, no scheme */
function hasAtSign(s: string): boolean {
  return s.includes("@") && !hasScheme(s);
}

// ─────────────────────────────────────────────────────────────
// Individual parsers
// ─────────────────────────────────────────────────────────────

/**
 * FORMAT 1 — Full URI
 * protocol://[user:pass@]host:port
 * protocol://[user:pass@][host]:port  (IPv6)
 */
export function parseUri(raw: string): ProxyEntry {
  const trimmed = raw.trim();
  const protoSep = trimmed.indexOf("://");
  if (protoSep === -1) throw new Error("Missing protocol. Use: protocol://host:port");

  const protocol = assertProtocol(trimmed.slice(0, protoSep));
  const rest = trimmed.slice(protoSep + 3);
  if (!rest) throw new Error("Missing host and port after ://");

  let username: string | undefined;
  let password: string | undefined;
  let hostPort: string;

  const atIdx = rest.lastIndexOf("@");
  if (atIdx !== -1) {
    const auth = rest.slice(0, atIdx);
    hostPort   = rest.slice(atIdx + 1);
    const ci   = auth.indexOf(":");
    username   = decodeURIComponent(ci === -1 ? auth : auth.slice(0, ci));
    password   = ci === -1 ? undefined : decodeURIComponent(auth.slice(ci + 1));
  } else {
    hostPort = rest;
  }

  const { host, port } = splitHostPort(hostPort);
  return makeEntry(protocol, host, port, username, password, trimmed);
}

/**
 * FORMAT 2 — host:port  (bare, no auth, no scheme)
 * Defaults to http. Optionally prefix with protocol: socks5:host:port
 */
export function parseHostPort(raw: string, defaultProtocol: ProxyProtocol = "http"): ProxyEntry {
  const trimmed = raw.trim();
  // Optional leading "protocol:" without "//"
  const firstColon = trimmed.indexOf(":");
  if (firstColon !== -1) {
    const maybeProto = trimmed.slice(0, firstColon).toLowerCase();
    if ((SUPPORTED_PROTOCOLS as readonly string[]).includes(maybeProto)) {
      const rest = trimmed.slice(firstColon + 1);
      const { host, port } = splitHostPort(rest);
      return makeEntry(maybeProto as ProxyProtocol, host, port, undefined, undefined, trimmed);
    }
  }
  const { host, port } = splitHostPort(trimmed);
  return makeEntry(defaultProtocol, host, port, undefined, undefined, trimmed);
}

/**
 * FORMAT 3 — host:port:username:password
 * Common in proxy lists / scraped lists
 */
export function parseColonQuad(raw: string, defaultProtocol: ProxyProtocol = "http"): ProxyEntry {
  const [host, portStr, username, password] = raw.trim().split(":");
  const port = parsePort(portStr);
  if (!host) throw new Error("Host cannot be empty.");
  return makeEntry(defaultProtocol, host, port, username, password, raw.trim());
}

/**
 * FORMAT 4 — username:password@host:port  (no scheme)
 */
export function parseAuthAtHostPort(raw: string, defaultProtocol: ProxyProtocol = "http"): ProxyEntry {
  const trimmed = raw.trim();
  const atIdx = trimmed.lastIndexOf("@");
  const auth  = trimmed.slice(0, atIdx);
  const ci    = auth.indexOf(":");
  const username = ci === -1 ? auth : auth.slice(0, ci);
  const password = ci === -1 ? undefined : auth.slice(ci + 1);
  const { host, port } = splitHostPort(trimmed.slice(atIdx + 1));
  return makeEntry(defaultProtocol, host, port, username, password, trimmed);
}

// ─────────────────────────────────────────────────────────────
// Universal auto-detect parser (single line)
// ─────────────────────────────────────────────────────────────

/**
 * Automatically detects which format is used and parses accordingly.
 * Throws with a clear message on failure.
 */
export function parseProxyUri(
  raw: string,
  defaultProtocol: ProxyProtocol = "http"
): ProxyEntry {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Proxy entry cannot be empty.");

  if (hasScheme(trimmed))   return parseUri(trimmed);
  if (isColonQuad(trimmed)) return parseColonQuad(trimmed, defaultProtocol);
  if (hasAtSign(trimmed))   return parseAuthAtHostPort(trimmed, defaultProtocol);
  return parseHostPort(trimmed, defaultProtocol);
}

// ─────────────────────────────────────────────────────────────
// Bulk parser — splits a text block into multiple entries
// ─────────────────────────────────────────────────────────────

export interface BulkParseResult {
  entries: ProxyEntry[];
  errors: Array<{ line: number; raw: string; message: string }>;
}

/**
 * Parses a multi-line string of proxies.
 * Skips blank lines and comment lines (# or //).
 * Each line is parsed with auto-detect.
 */
export function parseBulkProxies(
  text: string,
  defaultProtocol: ProxyProtocol = "http"
): BulkParseResult {
  const lines = text.split(/\r?\n/);
  const entries: ProxyEntry[] = [];
  const errors: BulkParseResult["errors"] = [];

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) return; // skip blanks/comments

    try {
      entries.push(parseProxyUri(line, defaultProtocol));
    } catch (err) {
      errors.push({
        line: idx + 1,
        raw: line,
        message: err instanceof Error ? err.message : "Parse error",
      });
    }
  });

  return { entries, errors };
}
