import React, { useState, useRef } from "react";
import { validateBypassRule, generateBypassId, detectBypassType } from "@/services/validationService";
import type { BypassRule } from "@/types/proxy.types";

interface Props { onAdd: (rule: BypassRule) => void; }

export const BypassForm: React.FC<Props> = ({ onAdd }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setError(null);
    try {
      const pattern = validateBypassRule(value);
      const type = detectBypassType(pattern);
      onAdd({ id: generateBypassId(), pattern, type, addedAt: Date.now() });
      setValue("");
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid bypass rule.");
    }
  };

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  return (
    <section className="card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Add New Bypass Rule
      </div>

      <div className="form-row">
        <input ref={inputRef} type="text"
          className={`text-input${error ? " error" : ""}`}
          placeholder="example.com or *.example.com or 192.168.1.0/24 or <local>"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          spellCheck={false} autoComplete="off"
        />
        <button className="btn-add" onClick={handleAdd}>
          Add
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      {error && (
        <div className="form-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          {error}
        </div>
      )}

      <div className="hint-box">
        <div className="hint-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span className="hint-header-text">Bypass Rule Format</span>
        </div>
        <p className="hint-desc">Add rules for hosts that should bypass the proxy:</p>
        <div className="bypass-hint-grid">
          {[
            { label: "Hostnames:", val: "example.com" },
            { label: "Subdomains:", val: "*.example.com" },
            { label: "IP Addresses:", val: "127.0.0.1" },
            { label: "CIDR blocks:", val: "192.168.1.0/24" },
            { label: "Match local:", val: "<local>" },
          ].map(({ label, val }) => (
            <div key={label} className="bypass-hint-cell">
              <CheckIcon />
              <div>
                <div className="bypass-hint-cell-title">{label}</div>
                <div className="bypass-hint-cell-val">{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
