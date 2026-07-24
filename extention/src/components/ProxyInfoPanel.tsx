import React, { useEffect, useState, useCallback, useRef } from "react";
import type { ProxyEntry } from "@/types/proxy.types";
import type { GeoData } from "@/types/message.types";

interface Props {
  proxy: ProxyEntry | null;
  isConnected: boolean;
}

type FetchState = "idle" | "loading" | "done" | "error";

const PROTO_AUTH_LABEL: Record<string, string> = {
  http:   "Basic",
  https:  "Basic",
  socks4: "SOCKS4",
  socks5: "User / Pass",
};

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
  } catch {
    return "";
  }
}

/** Ask the background service worker to do the geo fetch (no CORS limits) */
async function requestGeo(host: string): Promise<GeoData> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "FETCH_GEO", payload: { host } },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (response?.success && response.data) {
          resolve(response.data as GeoData);
        } else {
          reject(new Error(response?.error ?? "Geo lookup failed"));
        }
      }
    );
  });
}

// ── Shimmer tile ─────────────────────────────────────────────
const ShimmerValue: React.FC = () => <span className="info-tile-shimmer" />;

// ── Single info tile ─────────────────────────────────────────
const InfoTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  loading?: boolean;
}> = ({ icon, label, value, loading }) => (
  <div className="info-tile">
    <div className="info-tile-icon">{icon}</div>
    <div className="info-tile-body">
      <span className="info-tile-label">{label}</span>
      {loading ? <ShimmerValue /> : <span className="info-tile-value">{value}</span>}
    </div>
  </div>
);

// ── SVG icons ────────────────────────────────────────────────
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconServer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const IconRefresh = (props: { spinning: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
    style={{ animation: props.spinning ? "spin .8s linear infinite" : "none" }}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────
export const ProxyInfoPanel: React.FC<Props> = ({ proxy, isConnected }) => {
  const [geo,        setGeo]        = useState<GeoData | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [errorMsg,   setErrorMsg]   = useState("");
  const [expanded,   setExpanded]   = useState(false);   // ← collapsed by default
  const lastHostRef                 = useRef("");

  const doFetch = useCallback(async (host: string) => {
    setFetchState("loading");
    setGeo(null);
    setErrorMsg("");
    try {
      const data = await requestGeo(host);
      setGeo(data);
      setFetchState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Lookup failed");
      setFetchState("error");
    }
  }, []);

  useEffect(() => {
    if (!isConnected || !proxy) {
      setFetchState("idle");
      setGeo(null);
      lastHostRef.current = "";
      setExpanded(false);   // reset collapse when disconnected
      return;
    }
    if (proxy.host !== lastHostRef.current) {
      lastHostRef.current = proxy.host;
      // Only fetch if already expanded — lazy load
      if (expanded) doFetch(proxy.host);
    }
  }, [isConnected, proxy, doFetch, expanded]);

  // Don't render when not connected
  if (!isConnected || !proxy) return null;

  const isLoading  = fetchState === "loading";
  const hasError   = fetchState === "error";
  const authLabel  = PROTO_AUTH_LABEL[proxy.protocol] ?? "Unknown";
  const hasAuth    = !!proxy.username;

  const ipValue    = geo?.ip ?? proxy.host;
  const flagEmoji  = geo ? countryFlag(geo.countryCode) : "";
  const location   = geo
    ? [geo.city, geo.region, flagEmoji ? `${flagEmoji} ${geo.country}` : geo.country]
        .filter(Boolean).join(", ")
    : null;

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      // Trigger fetch on first open
      if (fetchState === "idle") {
        lastHostRef.current = "";
        doFetch(proxy.host);
      }
    } else {
      setExpanded(false);
    }
  };

  return (
    <div className="info-panel">

      {/* Collapsible header — always visible */}
      <button className="info-panel-header info-panel-toggle" onClick={handleExpand}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>Proxy Details</span>

        {/* Inline summary when collapsed */}
        {!expanded && (
          <span className="info-panel-collapsed-hint">
            <span className={`proto-badge proto-${proxy.protocol}`}>{proxy.protocol.toUpperCase()}</span>
            {geo && <span className="info-panel-ip">{geo.ip}</span>}
          </span>
        )}

        <span className="info-panel-chevron-wrap">
          {expanded && (
            <button
              className="info-refresh-btn"
              title="Refresh"
              disabled={isLoading}
              onClick={(e) => { e.stopPropagation(); lastHostRef.current = ""; doFetch(proxy.host); }}
            >
              <IconRefresh spinning={isLoading} />
            </button>
          )}
          <svg
            className={`info-chevron${expanded ? " open" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </button>

      {/* Expandable body */}
      {expanded && (
        <>
          <div className="info-tiles">

            <InfoTile icon={<IconGlobe />} label="Protocol"
              value={<span className={`proto-badge proto-${proxy.protocol}`}>{proxy.protocol.toUpperCase()}</span>}
            />

            <InfoTile icon={<IconLock />} label="Authentication"
              value={
                <span className={`info-auth-badge ${hasAuth ? "auth-yes" : "auth-no"}`}>
                  {hasAuth ? `${authLabel} ✓` : "None"}
                </span>
              }
            />

            <InfoTile icon={<IconServer />} label="IP Address" loading={isLoading}
              value={hasError ? <span className="info-na">N/A</span> : <span className="info-mono">{ipValue}</span>}
            />

            <InfoTile icon={<IconPin />} label="Location" loading={isLoading}
              value={hasError || !location
                ? <span className="info-na">N/A</span>
                : <span className="info-location">{location}</span>}
            />

            <InfoTile icon={<IconBuilding />} label="ISP / Org" loading={isLoading}
              value={hasError || !geo ? <span className="info-na">N/A</span> : <span className="info-isp">{geo.isp}</span>}
            />

            <InfoTile icon={<IconClock />} label="Timezone" loading={isLoading}
              value={hasError || !geo ? <span className="info-na">N/A</span> : <span className="info-tz">{geo.timezone}</span>}
            />

          </div>

          {hasError && (
            <div className="info-error-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {errorMsg || "Could not resolve geo info — check network access."}
              <button className="info-retry-btn"
                onClick={() => { lastHostRef.current = ""; doFetch(proxy.host); }}>
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
