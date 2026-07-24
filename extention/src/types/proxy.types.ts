export type ProxyProtocol = "http" | "https" | "socks4" | "socks5";

export interface ProxyEntry {
  id: string;
  protocol: ProxyProtocol;
  host: string;
  port: number;
  username?: string;
  password?: string;
  raw: string;
  addedAt: number;
  lastUsed?: number;
  weight?: number;           // for weighted rotation (1–10, default 1)
  testResult?: ProxyTestResult;
}

export interface ProxyTestResult {
  testedAt: number;
  latencyMs: number | null;
  downloadKbps: number | null;
  uploadKbps: number | null;
  dnsMs: number | null;
  sslValid: boolean | null;
  country: string | null;
  ip: string | null;
  status: ProxyTestStatus;
  flags: ProxyFlags;
}

export type ProxyTestStatus =
  | "untested"
  | "ok"
  | "slow"       // latency > threshold
  | "dead"       // connection refused / timeout
  | "blocked"    // returns captcha or block page
  | "leaked"     // DNS or IP leaks detected
  | "expired";   // 407 auth required but creds present

export interface ProxyFlags {
  dead: boolean;
  slow: boolean;
  captcha: boolean;
  blocked: boolean;
  credentialsExpired: boolean;
  dnsLeak: boolean;
}

export type BypassType = "local" | "wildcard" | "ip" | "cidr" | "hostname";

export interface BypassRule {
  id: string;
  pattern: string;
  type: BypassType;
  addedAt: number;
}

export type ProxyInputFormat =
  | "uri"
  | "host_port"
  | "ip_port_auth"
  | "auth_hostport"
  | "manual";
