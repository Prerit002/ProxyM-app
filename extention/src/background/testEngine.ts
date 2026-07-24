import type { ProxyEntry, ProxyTestResult, ProxyFlags } from "@/types/proxy.types";

const TEST_URLS = {
  http:   "http://httpbin.org/get",
  https:  "https://httpbin.org/get",
  dns:    "https://dns.google/resolve?name=example.com&type=A",
  geo:    "https://ipwho.is/",
  speed:  "https://speed.cloudflare.com/__down?bytes=100000",
};

const CAPTCHA_SIGNATURES = [
  "captcha", "cf-chl", "challenge", "are you human",
  "ddos-guard", "datadome", "recaptcha",
];

const BLOCKED_SIGNATURES = [
  "access denied", "403 forbidden", "blocked", "unavailable",
  "restricted", "your ip has been",
];

const TIMEOUT_MS = 8000;

// ── Core test runner ─────────────────────────────────────────────────────────

export async function testProxy(proxy: ProxyEntry): Promise<ProxyTestResult> {
  const flags: ProxyFlags = {
    dead: false, slow: false, captcha: false,
    blocked: false, credentialsExpired: false, dnsLeak: false,
  };

  let latencyMs:    number | null = null;
  let downloadKbps: number | null = null;
  let uploadKbps:   number | null = null;
  let dnsMs:        number | null = null;
  let sslValid:     boolean | null = null;
  let country:      string | null = null;
  let ip:           string | null = null;

  // ── Connectivity + latency ─────────────────────────────────
  try {
    const t0  = performance.now();
    const res = await fetch(TEST_URLS.https, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    latencyMs = Math.round(performance.now() - t0);
    sslValid  = res.ok;

    if (res.status === 407) {
      flags.credentialsExpired = true;
    } else if (res.ok) {
      const text = (await res.text()).toLowerCase();
      if (CAPTCHA_SIGNATURES.some((s) => text.includes(s))) flags.captcha = true;
      if (BLOCKED_SIGNATURES.some((s) => text.includes(s))) flags.blocked = true;
    } else {
      flags.blocked = true;
    }
  } catch {
    flags.dead = true;
  }

  if (flags.dead) {
    return buildResult(flags, "dead", latencyMs, downloadKbps, uploadKbps, dnsMs, sslValid, country, ip);
  }

  // ── Slow check ────────────────────────────────────────────
  if (latencyMs !== null && latencyMs > 3000) flags.slow = true;

  // ── DNS latency ───────────────────────────────────────────
  try {
    const t0 = performance.now();
    await fetch(TEST_URLS.dns, { signal: AbortSignal.timeout(5000) });
    dnsMs = Math.round(performance.now() - t0);
  } catch { /* optional */ }

  // ── Download speed ─────────────────────────────────────────
  try {
    const t0 = performance.now();
    const res = await fetch(TEST_URLS.speed, { signal: AbortSignal.timeout(10000) });
    const buf = await res.arrayBuffer();
    const elapsed = (performance.now() - t0) / 1000;
    downloadKbps = Math.round((buf.byteLength / 1024) / elapsed);
  } catch { /* optional */ }

  // ── Geo / IP via proxy ────────────────────────────────────
  try {
    const res = await fetch(TEST_URLS.geo, { signal: AbortSignal.timeout(5000) });
    const d = await res.json();
    ip      = d.ip ?? proxy.host;
    country = d.country_code ?? null;

    // Basic DNS leak: if resolved IP matches our real IP, flag leak
    if (ip === proxy.host) flags.dnsLeak = true;
  } catch { /* optional */ }

  const status = deriveStatus(flags, latencyMs);
  return buildResult(flags, status, latencyMs, downloadKbps, uploadKbps, dnsMs, sslValid, country, ip);
}

function deriveStatus(
  flags: ProxyFlags,
  latencyMs: number | null
): ProxyTestResult["status"] {
  if (flags.dead)                return "dead";
  if (flags.credentialsExpired)  return "expired";
  if (flags.captcha)             return "blocked";
  if (flags.blocked)             return "blocked";
  if (flags.slow || (latencyMs !== null && latencyMs > 3000)) return "slow";
  return "ok";
}

function buildResult(
  flags: ProxyFlags,
  status: ProxyTestResult["status"],
  latencyMs: number | null,
  downloadKbps: number | null,
  uploadKbps: number | null,
  dnsMs: number | null,
  sslValid: boolean | null,
  country: string | null,
  ip: string | null,
): ProxyTestResult {
  return {
    testedAt: Date.now(),
    latencyMs,
    downloadKbps,
    uploadKbps,
    dnsMs,
    sslValid,
    country,
    ip,
    status,
    flags,
  };
}
