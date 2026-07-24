import type { ProxyEntry, BypassRule } from "./proxy.types";

export type Theme = "light" | "dark";
export type RotationMode = "round-robin" | "random" | "weighted" | "sticky";
export type RotationTrigger = "time" | "requests" | "tab-change" | "browser-restart";

export interface RotationConfig {
  mode: RotationMode;
  trigger: RotationTrigger;
  intervalMinutes: number;
  intervalRequests: number;
  skipFailed: boolean;
  retryCount: number;
  cooldownMinutes: number;
  stickySessionMinutes: number;
}

export interface AutoDetectConfig {
  enabled: boolean;
  deadProxy: boolean;
  slowProxy: boolean;
  slowThresholdMs: number;
  captchaProxy: boolean;
  blockedProxy: boolean;
  expiredCredentials: boolean;
  autoRemoveDead: boolean;
  autoSkipFlagged: boolean;
}

export interface AppSettings {
  enabled: boolean;
  rotationIntervalMinutes: number;  // kept for backward compat
  activeProxyId: string | null;
  proxies: ProxyEntry[];
  bypassRules: BypassRule[];
  theme: Theme;
  rotation: RotationConfig;
  autoDetect: AutoDetectConfig;
}

export const DEFAULT_ROTATION: RotationConfig = {
  mode: "round-robin",
  trigger: "time",
  intervalMinutes: 1,
  intervalRequests: 100,
  skipFailed: true,
  retryCount: 2,
  cooldownMinutes: 5,
  stickySessionMinutes: 30,
};

export const DEFAULT_AUTO_DETECT: AutoDetectConfig = {
  enabled: true,
  deadProxy: true,
  slowProxy: true,
  slowThresholdMs: 3000,
  captchaProxy: true,
  blockedProxy: true,
  expiredCredentials: true,
  autoRemoveDead: false,
  autoSkipFlagged: true,
};

export const DEFAULT_SETTINGS: AppSettings = {
  enabled: false,
  rotationIntervalMinutes: 1,
  activeProxyId: null,
  proxies: [],
  bypassRules: [],
  theme: "light",
  rotation: DEFAULT_ROTATION,
  autoDetect: DEFAULT_AUTO_DETECT,
};
