import type { AppSettings } from "./settings.types";
import type { ProxyTestResult } from "./proxy.types";

export type MessageType =
  | "GET_SETTINGS"
  | "SAVE_SETTINGS"
  | "APPLY_PROXY"
  | "CLEAR_PROXY"
  | "ROTATE_NOW"
  | "GET_ACTIVE_PROXY"
  | "FETCH_GEO"
  | "TEST_PROXY"
  | "TEST_ALL_PROXIES"
  | "AUTO_DETECT_ALL";

export interface Message<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SaveSettingsPayload { settings: AppSettings; }
export interface FetchGeoPayload     { host: string; }
export interface TestProxyPayload    { proxyId: string; }

export interface GeoData {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  timezone: string;
}

export interface TestProxyResponse {
  proxyId: string;
  result: ProxyTestResult;
}
