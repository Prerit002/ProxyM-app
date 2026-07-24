import React from "react";
import type { AppSettings } from "@/types/settings.types";
import { ProxyInfoPanel } from "./ProxyInfoPanel";

interface Props {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

type ConnectionState = "closed" | "waiting" | "connected";

function getConnectionState(settings: AppSettings): ConnectionState {
  if (!settings.enabled) return "closed";
  const hasActive = settings.proxies.some((p) => p.id === settings.activeProxyId);
  if (hasActive) return "connected";
  return "waiting";
}

export const SettingsPanel: React.FC<Props> = ({ settings, onChange }) => {
  const inc = () => onChange({ rotationIntervalMinutes: Math.min(9999, settings.rotationIntervalMinutes + 1) });
  const dec = () => onChange({ rotationIntervalMinutes: Math.max(1, settings.rotationIntervalMinutes - 1) });

  const connState = getConnectionState(settings);
  const activeProxy = settings.proxies.find((p) => p.id === settings.activeProxyId);

  return (
    <section className="card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        Settings &amp; Info
      </div>

      {/* 2-column settings grid */}
      <div className="settings-grid">
        <div className="setting-cell">
          <div className="setting-cell-inner">
            <div>
              <div className="setting-label">Enable Proxy Manager</div>
              <div className="setting-desc">Turn proxy routing on or off globally</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.enabled}
                onChange={(e) => onChange({ enabled: e.target.checked })} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
            </label>
          </div>
        </div>

        <div className="setting-cell">
          <div className="setting-cell-inner">
            <div>
              <div className="setting-label">Rotation Interval</div>
              <div className="setting-desc">Time between proxy changes</div>
            </div>
            <div className="interval-input">
              <input type="number" min={1} max={9999}
                value={settings.rotationIntervalMinutes}
                onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 1) onChange({ rotationIntervalMinutes: v }); }}
              />
              <div className="interval-spin">
                <button onClick={inc} title="Increase">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button onClick={dec} title="Decrease">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
              <span className="interval-unit">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Current Connection ── */}
      <div className="conn-section">
        <div className="conn-label">CURRENT CONNECTION</div>

        {/* CLOSED — proxy manager is off */}
        {connState === "closed" && (
          <div className="conn-state conn-closed">
            <div className="conn-icon conn-icon-closed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64A9 9 0 0 1 20.77 15"/>
                <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/>
                <path d="M12 2v4M2 12h4M12 18v4M18 12h4"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
              </svg>
            </div>
            <div className="conn-info">
              <span className="conn-status-text conn-text-closed">Closed</span>
              <span className="conn-sub-text">Proxy manager is disabled</span>
            </div>
          </div>
        )}

        {/* WAITING — enabled but no proxy connected yet */}
        {connState === "waiting" && (
          <div className="conn-state conn-waiting">
            <div className="conn-icon conn-icon-waiting">
              <div className="conn-spinner" />
            </div>
            <div className="conn-info">
              <span className="conn-status-text conn-text-waiting">Waiting...</span>
              <span className="conn-sub-text">
                {settings.proxies.length === 0
                  ? "Add a proxy below to get started"
                  : "Connecting to proxy..."}
              </span>
            </div>
          </div>
        )}

        {/* CONNECTED — active proxy is set */}
        {connState === "connected" && activeProxy && (
          <div className="conn-state conn-connected">
            <div className="conn-icon conn-icon-connected">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="conn-info">
              <span className="conn-status-text conn-text-connected">Connected</span>
              <span className="conn-proxy-host">
                <span className="conn-proto-pill">{activeProxy.protocol.toUpperCase()}</span>
                {activeProxy.host}:{activeProxy.port}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Proxy Info tiles (only when connected) ── */}
      <ProxyInfoPanel
        proxy={activeProxy ?? null}
        isConnected={connState === "connected"}
      />
    </section>
  );
};
