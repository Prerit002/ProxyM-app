import React, { useState } from "react";
import type { RotationConfig, RotationMode, RotationTrigger } from "@/types/settings.types";

interface Props {
  config: RotationConfig;
  onChange: (patch: Partial<RotationConfig>) => void;
}

const ModeBtn: React.FC<{ label: string; value: RotationMode; active: boolean; onClick: () => void }> =
  ({ label, value, active, onClick }) => (
    <button className={`mode-btn${active ? " active" : ""}`} onClick={onClick} title={value}>{label}</button>
  );

const TriggerBtn: React.FC<{ label: string; value: RotationTrigger; active: boolean; onClick: () => void }> =
  ({ label, active, onClick }) => (
    <button className={`trigger-btn${active ? " active" : ""}`} onClick={onClick}>{label}</button>
  );

const NumField: React.FC<{
  label: string; value: number; min: number; max: number; suffix: string;
  onChange: (v: number) => void; disabled?: boolean;
}> = ({ label, value, min, max, suffix, onChange, disabled }) => (
  <div className="rot-field">
    <span className="rot-field-label">{label}</span>
    <div className="interval-input">
      <input type="number" min={min} max={max} value={value} disabled={disabled}
        onChange={(e) => { const v = parseInt(e.target.value,10); if(!isNaN(v) && v >= min) onChange(v); }} />
      <span className="suffix">{suffix}</span>
    </div>
  </div>
);

export const SmartRotation: React.FC<Props> = ({ config, onChange }) => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <section className="card">
        <button className="collapsible-row" onClick={() => setOpen(true)}>
          <svg className="collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          <span className="collapsible-title">Smart Rotation</span>
          <span className="collapsible-badge badge-active">{config.mode}</span>
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
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        <span className="collapsible-title">Smart Rotation</span>
        <span className="collapsible-badge badge-active" style={{ marginLeft: "auto" }}>{config.mode}</span>
        <svg className="collapsible-chevron open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      <div className="rot-body">

        {/* ── Rotation Mode ── */}
        <div className="rot-section">
          <div className="rot-section-label">Rotation Mode</div>
          <div className="mode-grid">
            {([
              { v: "round-robin", l: "Round Robin"  },
              { v: "random",      l: "Random"       },
              { v: "weighted",    l: "Weighted"     },
              { v: "sticky",      l: "Sticky"       },
            ] as { v: RotationMode; l: string }[]).map(({ v, l }) => (
              <ModeBtn key={v} label={l} value={v}
                active={config.mode === v}
                onClick={() => onChange({ mode: v })} />
            ))}
          </div>
          {config.mode === "weighted" && (
            <p className="rot-hint">Set per-proxy weight in the Proxy List (1 = lowest priority, 10 = highest).</p>
          )}
          {config.mode === "sticky" && (
            <NumField label="Sticky session" value={config.stickySessionMinutes} min={1} max={1440}
              suffix="min" onChange={(v) => onChange({ stickySessionMinutes: v })} />
          )}
        </div>

        {/* ── Rotate Trigger ── */}
        <div className="rot-section">
          <div className="rot-section-label">Rotate Every</div>
          <div className="trigger-grid">
            {([
              { v: "time",            l: "Time interval"    },
              { v: "requests",        l: "X requests"       },
              { v: "tab-change",      l: "Tab change"       },
              { v: "browser-restart", l: "Browser restart"  },
            ] as { v: RotationTrigger; l: string }[]).map(({ v, l }) => (
              <TriggerBtn key={v} label={l} value={v}
                active={config.trigger === v}
                onClick={() => onChange({ trigger: v })} />
            ))}
          </div>

          {config.trigger === "time" && (
            <NumField label="Interval" value={config.intervalMinutes} min={1} max={9999}
              suffix="min" onChange={(v) => onChange({ intervalMinutes: v })} />
          )}
          {config.trigger === "requests" && (
            <NumField label="After" value={config.intervalRequests} min={1} max={100000}
              suffix="req" onChange={(v) => onChange({ intervalRequests: v })} />
          )}
        </div>

        {/* ── Failure Handling ── */}
        <div className="rot-section">
          <div className="rot-section-label">Failure Handling</div>
          <div className="rot-toggles">
            <div className="rot-toggle-row">
              <div>
                <div className="rot-toggle-label">Skip failed proxies</div>
                <div className="rot-toggle-desc">Skip dead, blocked, or slow during rotation</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={config.skipFailed} onChange={(e) => onChange({ skipFailed: e.target.checked })} />
                <span className="toggle-track"><span className="toggle-thumb" /></span>
              </label>
            </div>
            <div className="rot-toggle-row">
              <NumField label="Retry attempts" value={config.retryCount} min={0} max={10}
                suffix="×" onChange={(v) => onChange({ retryCount: v })} />
            </div>
            <div className="rot-toggle-row">
              <NumField label="Cooldown before reuse" value={config.cooldownMinutes} min={0} max={1440}
                suffix="min" onChange={(v) => onChange({ cooldownMinutes: v })} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
