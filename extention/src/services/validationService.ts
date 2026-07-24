import type { BypassType } from "@/types/proxy.types";

export function detectBypassType(pattern: string): BypassType {
  const p = pattern.trim();
  if (p === "<local>") return "local";
  if (p.startsWith("*.")) return "wildcard";
  if (/^[\d.]+\/\d+$/.test(p) || /^[\da-fA-F:]+\/\d+$/.test(p)) return "cidr";
  if (/^[\d.]+$/.test(p) || /^[\da-fA-F:]+$/.test(p)) return "ip";
  return "hostname";
}

export function validateBypassRule(pattern: string): string {
  const p = pattern.trim();
  if (!p) throw new Error("Bypass rule cannot be empty.");
  if (p === "<local>") return p;
  if (/^[\d.]+\/\d+$/.test(p) || /^[\da-fA-F:]+\/\d+$/.test(p)) return p;
  if (p.startsWith("*.")) {
    const rest = p.slice(2);
    if (!rest || rest.includes("*")) throw new Error("Invalid wildcard pattern.");
    return p;
  }
  if (/\s/.test(p)) throw new Error("Bypass rule cannot contain spaces.");
  if (p.includes("/")) throw new Error('Only CIDR notation allows "/". Use format: 192.168.0.0/24');
  return p;
}

export function generateBypassId(): string {
  return `bypass_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
