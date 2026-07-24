import React, { useState, useRef, useCallback } from "react";
import { parseProxyUri, parseBulkProxies } from "@/utils/parseProxyUri";
import type { ProxyEntry, ProxyProtocol } from "@/types/proxy.types";

interface Props { onAdd: (proxy: ProxyEntry) => void; onAddMany?: (proxies: ProxyEntry[]) => void; }

type Tab = "uri" | "manual" | "bulk";

const PROTOCOLS: ProxyProtocol[] = ["http", "https", "socks4", "socks5"];


// ── Sub-components ────────────────────────────────────────────

const TabBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button className={`proxy-tab-btn${active ? " active" : ""}`} onClick={onClick}>{children}</button>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`hint-chevron-icon${open ? " open" : ""}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
  >
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────

export const ProxyForm: React.FC<Props> = ({ onAdd, onAddMany }) => {
  const [tab, setTab] = useState<Tab>("uri");

  // URI tab
  const [uriValue, setUriValue]   = useState("");
  const [uriError, setUriError]   = useState<string | null>(null);
  const [defaultProto, setDefaultProto] = useState<ProxyProtocol>("http");
  const [uriHintOpen, setUriHintOpen]   = useState(false);
  const uriRef = useRef<HTMLInputElement>(null);

  // Manual tab
  const [manProto,    setManProto]    = useState<ProxyProtocol>("http");
  const [manHost,     setManHost]     = useState("");
  const [manPort,     setManPort]     = useState("");
  const [manUser,     setManUser]     = useState("");
  const [manPass,     setManPass]     = useState("");
  const [manShowPass, setManShowPass] = useState(false);
  const [manError,    setManError]    = useState<string | null>(null);

  // Bulk tab
  const [bulkText,    setBulkText]    = useState("");
  const [bulkProto,   setBulkProto]   = useState<ProxyProtocol>("http");
  const [bulkResult,  setBulkResult]  = useState<{ ok: number; bad: number; lines: string[] } | null>(null);
  const [isDragging,  setIsDragging]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── URI handler ────────────────────────────────────────────
  const handleUriAdd = () => {
    setUriError(null);
    try {
      const proxy = parseProxyUri(uriValue, defaultProto);
      onAdd(proxy);
      setUriValue("");
      uriRef.current?.focus();
    } catch (err) {
      setUriError(err instanceof Error ? err.message : "Invalid proxy.");
    }
  };

  // ── Manual handler ─────────────────────────────────────────
  const handleManualAdd = () => {
    setManError(null);
    const host = manHost.trim();
    const portN = parseInt(manPort, 10);
    if (!host) { setManError("Host is required."); return; }
    if (isNaN(portN) || portN < 1 || portN > 65535) { setManError("Port must be 1–65535."); return; }
    const proxy: ProxyEntry = {
      id: `proxy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      protocol: manProto, host, port: portN,
      username: manUser.trim() || undefined,
      password: manPass || undefined,
      raw: `${manProto}://${manUser.trim() ? `${manUser.trim()}:${manPass}@` : ""}${host}:${portN}`,
      addedAt: Date.now(),
    };
    onAdd(proxy);
    setManHost(""); setManPort(""); setManUser(""); setManPass("");
  };

  // ── Bulk handler ───────────────────────────────────────────
  const handleBulkAdd = () => {
    const { entries, errors } = parseBulkProxies(bulkText, bulkProto);
    if (entries.length === 0 && errors.length === 0) { setBulkResult({ ok: 0, bad: 0, lines: ["Nothing to import — paste some proxies above."] }); return; }
    entries.forEach(onAdd);
    onAddMany?.(entries);
    setBulkResult({
      ok: entries.length,
      bad: errors.length,
      lines: errors.map((e) => `Line ${e.line}: ${e.raw} → ${e.message}`),
    });
    if (errors.length === 0) setBulkText("");
  };

  // ── File import ────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setBulkText(text);
      setBulkResult(null);
      setTab("bulk");
    };
    reader.readAsText(file);
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <section className="card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        Add New Proxy
      </div>

      {/* Tab bar */}
      <div className="proxy-tabs">
        <TabBtn active={tab === "uri"}    onClick={() => setTab("uri")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          URI
        </TabBtn>
        <TabBtn active={tab === "manual"} onClick={() => setTab("manual")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Manual
        </TabBtn>
        <TabBtn active={tab === "bulk"}   onClick={() => setTab("bulk")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          Bulk Import
        </TabBtn>

        {/* File import shortcut always visible */}
        <button className="proxy-tab-file-btn" title="Import from .txt file" onClick={() => fileRef.current?.click()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Import File
        </button>
        <input ref={fileRef} type="file" accept=".txt,.csv,.list,.conf" style={{ display: "none" }} onChange={handleFileInput} />
      </div>

      {/* ── URI tab ── */}
      {tab === "uri" && (
        <div className="tab-panel">
          <div className="pf-row">
            <select className="proto-select" value={defaultProto} onChange={(e) => setDefaultProto(e.target.value as ProxyProtocol)}>
              {PROTOCOLS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
            <input ref={uriRef} type="text"
              className={`text-input${uriError ? " error" : ""}`}
              placeholder="protocol://[user:pass@]host:port  or  host:port  or  host:port:user:pass"
              value={uriValue}
              onChange={(e) => { setUriValue(e.target.value); setUriError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleUriAdd()}
              spellCheck={false} autoComplete="off"
            />
            <button className="btn-add" onClick={handleUriAdd}>
              Add <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          {uriError && <div className="form-error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>{uriError}</div>}

          <div className="hint-box">
            <button
              className="hint-box-toggle"
              onClick={() => setUriHintOpen(v => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span className="hint-header-text">Supported Input Formats</span>
              <ChevronIcon open={uriHintOpen} />
            </button>

            {uriHintOpen && (
              <>
                <div className="uri-formats-grid">
                  {[
                    { label: "Full URI",            fmt: "protocol://[user:pass@]host:port", ex: "socks5://user:pass@1.2.3.4:1080" },
                    { label: "Host:Port",           fmt: "host:port",                         ex: "192.168.1.1:8080" },
                    { label: "Host:Port:User:Pass", fmt: "host:port:username:password",       ex: "1.2.3.4:3128:admin:secret" },
                    { label: "Auth@Host:Port",      fmt: "user:pass@host:port",               ex: "admin:pass@proxy.net:8080" },
                  ].map(({ label, fmt, ex }) => (
                    <div key={label} className="uri-format-row"
                      onClick={() => { setUriValue(ex); setUriError(null); uriRef.current?.focus(); }}
                      title="Click to use example"
                    >
                      <span className="uri-fmt-label">{label}</span>
                      <code className="uri-fmt-code">{fmt}</code>
                      <span className="uri-fmt-ex">{ex}</span>
                    </div>
                  ))}
                </div>
                <div className="hint-cols" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="hint-col">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <div><div className="hint-col-title">Protocols</div><div className="hint-col-body">http · https · socks4 · socks5</div></div>
                  </div>
                  <div className="hint-col">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <div><div className="hint-col-title">Auth</div><div className="hint-col-body">Optional — omit if proxy is open. Selector sets fallback protocol for bare formats.</div></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Manual tab ── */}
      {tab === "manual" && (
        <div className="tab-panel">
          <div className="manual-grid">
            <div className="manual-field">
              <label className="field-label">Protocol</label>
              <select className="proto-select full" value={manProto} onChange={(e) => setManProto(e.target.value as ProxyProtocol)}>
                {PROTOCOLS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="manual-field manual-field-host">
              <label className="field-label">Host / IP</label>
              <input type="text" className={`text-input${manError && !manHost.trim() ? " error" : ""}`}
                placeholder="proxy.example.com or 192.168.1.1"
                value={manHost} onChange={(e) => { setManHost(e.target.value); setManError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                spellCheck={false} autoComplete="off" />
            </div>
            <div className="manual-field manual-field-port">
              <label className="field-label">Port</label>
              <input type="number" className={`text-input${manError && (isNaN(parseInt(manPort)) || !manPort) ? " error" : ""}`}
                placeholder="8080" min={1} max={65535}
                value={manPort} onChange={(e) => { setManPort(e.target.value); setManError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()} />
            </div>
            <div className="manual-field">
              <label className="field-label">Username <span className="field-optional">optional</span></label>
              <input type="text" className="text-input"
                placeholder="username"
                value={manUser} onChange={(e) => setManUser(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                autoComplete="off" />
            </div>
            <div className="manual-field">
              <label className="field-label">Password <span className="field-optional">optional</span></label>
              <div className="pass-wrap">
                <input type={manShowPass ? "text" : "password"} className="text-input"
                  placeholder="password"
                  value={manPass} onChange={(e) => setManPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                  autoComplete="new-password" />
                <button className="pass-toggle" onClick={() => setManShowPass(v => !v)} title={manShowPass ? "Hide" : "Show"}>
                  {manShowPass
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
          </div>

          {manError && <div className="form-error" style={{ margin: "0 18px 12px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>{manError}</div>}

          <div className="pf-row pf-row-footer">
            <div className="manual-preview">
              {manHost && manPort ? (
                <code className="preview-code">
                  {manProto}://{manUser ? `${manUser}:${manPass ? "••••" : ""}@` : ""}{manHost}:{manPort}
                </code>
              ) : (
                <span className="preview-placeholder">Preview will appear here</span>
              )}
            </div>
            <button className="btn-add" onClick={handleManualAdd}>
              Add Proxy <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk tab ── */}
      {tab === "bulk" && (
        <div className="tab-panel">
          <div className="bulk-toolbar">
            <span className="bulk-label">Default protocol for bare entries:</span>
            <select className="proto-select" value={bulkProto} onChange={(e) => setBulkProto(e.target.value as ProxyProtocol)}>
              {PROTOCOLS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>

          <div
            className={`bulk-drop-zone${isDragging ? " dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            <textarea
              className="bulk-textarea"
              placeholder={"Paste proxies — one per line. Supports all formats:\n\nhttp://user:pass@host:port\nhost:port\nhost:port:user:pass\nuser:pass@host:port\n\nLines starting with # are ignored."}
              value={bulkText}
              onChange={(e) => { setBulkText(e.target.value); setBulkResult(null); }}
              spellCheck={false}
            />
            {isDragging && (
              <div className="drop-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Drop .txt file to import</span>
              </div>
            )}
          </div>

          <div className="pf-row pf-row-footer">
            <button className="btn-ghost-sm" onClick={() => { setBulkText(""); setBulkResult(null); }}>Clear</button>
            <button className="btn-ghost-sm" onClick={() => fileRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Load File
            </button>
            <div style={{ flex: 1 }} />
            <span className="bulk-count-hint">{bulkText.split("\n").filter(l => l.trim() && !l.trim().startsWith("#")).length} entries detected</span>
            <button className="btn-add" onClick={handleBulkAdd}>
              Import All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          {bulkResult && (
            <div className={`bulk-result ${bulkResult.bad === 0 ? "bulk-ok" : "bulk-partial"}`}>
              <div className="bulk-result-summary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  {bulkResult.bad === 0
                    ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                    : <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>
                  }
                </svg>
                <strong>{bulkResult.ok} imported</strong>
                {bulkResult.bad > 0 && <span className="bulk-bad">, {bulkResult.bad} failed</span>}
              </div>
              {bulkResult.lines.length > 0 && (
                <ul className="bulk-errors">
                  {bulkResult.lines.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
