import React, { useState } from "react";
import type { AutoDetectConfig } from "@/types/settings.types";

interface Props {
  config: AutoDetectConfig;
  onChange: (patch: Partial<AutoDetectConfig>) => void;
  onRunNow: () => void;
  running: boolean;
}

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <label className="toggle" style={{ opacity: disabled ? .4 : 1 }}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    <span className="toggle-track"><span className="toggle-thumb" /></span>
  </label>
);

const Row: React.FC<{
  label: string;
  desc: string;
  icon: React.ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, desc, icon, checked, disabled, onChange }) => (
  <div className={`ad-row${disabled ? " ad-row-disabled" : ""}`}>
    <div className="ad-row-icon">{icon}</div>
    <div className="ad-row-info">
      <span className="ad-row-label">{label}</span>
      <span className="ad-row-desc">{desc}</span>
    </div>
    <Toggle checked={checked} onChange={onChange} disabled={disabled} />
  </div>
);

export const AutoDetect: React.FC<Props> = ({ config, onChange, onRunNow, running }) => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <section className="card">
        <button className="collapsible-row" onClick={() => setOpen(true)}>
          <svg className="collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="collapsible-title">Auto Detection</span>
          <span className={`collapsible-badge${config.enabled ? " badge-active" : ""}`}>
            {config.enabled ? "Enabled" : "Disabled"}
          </span>
          <svg className="collapsible-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </section>
    );
  }

  return (
    <section className="card">
      <button className="collapsible-row open" onClick={() => setOpen(false)}>
        <svg className="collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="collapsible-title">Auto Detection</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className={`btn-run-detect${running ? " running" : ""}`}
            disabled={running}
            onClick={(e) => { e.stopPropagation(); onRunNow(); }}
          >
            {running ? <><span className="spinner-xs"/>Scanning…</> : "Scan Now"}
          </button>
          <Toggle checked={config.enabled} onChange={(v) => onChange({ enabled: v })} />
        </div>
        <svg className="collapsible-chevron open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      <div className="ad-body">
        <div className="ad-section-title">Detect Automatically</div>

        <Row label="Dead Proxies" desc="Connection refused or timed out"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>}
          checked={config.deadProxy} disabled={!config.enabled}
          onChange={(v) => onChange({ deadProxy: v })} />

        <Row label="Slow Proxies" desc={`Latency above ${config.slowThresholdMs}ms`}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
          checked={config.slowProxy} disabled={!config.enabled}
          onChange={(v) => onChange({ slowProxy: v })} />

        <div className="ad-threshold-row">
          <span className="ad-threshold-label">Slow threshold</span>
          <div className="interval-input" style={{ width: "auto" }}>
            <input type="number" min={500} max={30000} step={100}
              value={config.slowThresholdMs}
              disabled={!config.enabled || !config.slowProxy}
              onChange={(e) => { const v = parseInt(e.target.value,10); if(!isNaN(v)) onChange({ slowThresholdMs: v }); }}
            />
            <span className="suffix">ms</span>
          </div>
        </div>

        <Row label="Captcha-Heavy" desc="Proxy triggers captcha challenges"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
          checked={config.captchaProxy} disabled={!config.enabled}
          onChange={(v) => onChange({ captchaProxy: v })} />

        <Row label="Blocked Proxies" desc="Returns 403 / access-denied page"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>}
          checked={config.blockedProxy} disabled={!config.enabled}
          onChange={(v) => onChange({ blockedProxy: v })} />

        <Row label="Expired Credentials" desc="407 Proxy Auth Required errors"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>}
          checked={config.expiredCredentials} disabled={!config.enabled}
          onChange={(v) => onChange({ expiredCredentials: v })} />

        <div className="ad-section-title" style={{ marginTop: 12 }}>Actions</div>

        <Row label="Auto-remove Dead" desc="Permanently delete dead proxies from list"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>}
          checked={config.autoRemoveDead} disabled={!config.enabled}
          onChange={(v) => onChange({ autoRemoveDead: v })} />

        <Row label="Auto-skip Flagged" desc="Skip slow/blocked proxies during rotation"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>}
          checked={config.autoSkipFlagged} disabled={!config.enabled}
          onChange={(v) => onChange({ autoSkipFlagged: v })} />
      </div>
    </section>
  );
};
