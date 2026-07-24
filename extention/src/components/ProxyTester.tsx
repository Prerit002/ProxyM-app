import React, { useState, useCallback } from "react";
import type { ProxyEntry, ProxyTestResult } from "@/types/proxy.types";

interface Props {
  proxies: ProxyEntry[];
  onResultsUpdate: (proxies: ProxyEntry[]) => void;
}

type TestingState = Record<string, "idle" | "running" | "done" | "error">;

function statusColor(s?: ProxyTestResult["status"]): string {
  if (!s || s === "untested") return "var(--text-4)";
  if (s === "ok")      return "var(--success)";
  if (s === "slow")    return "var(--warning)";
  return "var(--danger)";
}

function statusLabel(s?: ProxyTestResult["status"]): string {
  if (!s || s === "untested") return "—";
  const map: Record<string, string> = {
    ok: "OK", slow: "Slow", dead: "Dead",
    blocked: "Blocked", expired: "Expired", leaked: "Leak",
  };
  return map[s] ?? s;
}

async function runTest(proxyId: string): Promise<ProxyTestResult> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "TEST_PROXY", payload: { proxyId } },
      (res) => {
        if (chrome.runtime.lastError) { reject(new Error(chrome.runtime.lastError.message)); return; }
        if (res?.success) resolve(res.data.result);
        else reject(new Error(res?.error ?? "Test failed"));
      }
    );
  });
}

async function runAll(): Promise<Record<string, ProxyTestResult>> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "TEST_ALL_PROXIES" }, (res) => {
      if (chrome.runtime.lastError) { reject(new Error(chrome.runtime.lastError.message)); return; }
      if (res?.success) resolve(res.data);
      else reject(new Error(res?.error ?? "Test failed"));
    });
  });
}

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="test-stat">
    <span className="test-stat-label">{label}</span>
    <span className="test-stat-value">{value}</span>
  </div>
);

export const ProxyTester: React.FC<Props> = ({ proxies, onResultsUpdate }) => {
  const [open,    setOpen]    = useState(false);
  const [testing, setTesting] = useState<TestingState>({});
  const [allRunning, setAllRunning] = useState(false);

  const testOne = useCallback(async (proxy: ProxyEntry) => {
    setTesting(prev => ({ ...prev, [proxy.id]: "running" }));
    try {
      const result = await runTest(proxy.id);
      setTesting(prev => ({ ...prev, [proxy.id]: "done" }));
      onResultsUpdate(proxies.map(p => p.id === proxy.id ? { ...p, testResult: result } : p));
    } catch {
      setTesting(prev => ({ ...prev, [proxy.id]: "error" }));
    }
  }, [proxies, onResultsUpdate]);

  const testAll = useCallback(async () => {
    setAllRunning(true);
    const init: TestingState = {};
    proxies.forEach(p => { init[p.id] = "running"; });
    setTesting(init);
    try {
      const results = await runAll();
      const done: TestingState = {};
      proxies.forEach(p => { done[p.id] = "done"; });
      setTesting(done);
      onResultsUpdate(proxies.map(p => ({
        ...p,
        testResult: results[p.id] as ProxyTestResult ?? p.testResult,
      })));
    } catch {
      const err: TestingState = {};
      proxies.forEach(p => { err[p.id] = "error"; });
      setTesting(err);
    }
    setAllRunning(false);
  }, [proxies, onResultsUpdate]);

  if (!open) {
    return (
      <section className="card">
        <button className="collapsible-row" onClick={() => setOpen(true)}>
          <svg className="collapsible-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <span className="collapsible-title">Proxy Testing</span>
          <span className="collapsible-badge">{proxies.length} proxies</span>
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <span className="collapsible-title">Proxy Testing</span>
        <span className="collapsible-badge">{proxies.length} proxies</span>
        <button
          className={`btn-test-all${allRunning ? " running" : ""}`}
          disabled={allRunning || proxies.length === 0}
          onClick={(e) => { e.stopPropagation(); testAll(); }}
        >
          {allRunning
            ? <><span className="spinner-xs" /> Testing all…</>
            : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{width:12,height:12}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Test All</>
          }
        </button>
        <svg className="collapsible-chevron open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {proxies.length === 0 ? (
        <div className="tester-empty">No proxies to test. Add proxies first.</div>
      ) : (
        <div className="tester-list">
          {proxies.map(proxy => {
            const r   = proxy.testResult;
            const t   = testing[proxy.id] ?? "idle";
            const running = t === "running";

            return (
              <div key={proxy.id} className={`tester-row${r ? ` status-${r.status}` : ""}`}>
                <div className="tester-row-left">
                  <span className="tester-status-dot" style={{ background: statusColor(r?.status) }} />
                  <div className="tester-host">
                    <span className={`proto-badge proto-${proxy.protocol}`}>{proxy.protocol.toUpperCase()}</span>
                    <span className="tester-hostport">{proxy.host}:{proxy.port}</span>
                  </div>
                </div>

                {r && (
                  <div className="tester-stats">
                    <Stat label="Status"   value={<span style={{ color: statusColor(r.status), fontWeight: 700 }}>{statusLabel(r.status)}</span>} />
                    <Stat label="Latency"  value={r.latencyMs != null ? `${r.latencyMs}ms` : "—"} />
                    <Stat label="Country"  value={r.country ?? "—"} />
                    <Stat label="Download" value={r.downloadKbps != null ? `${r.downloadKbps}KB/s` : "—"} />
                    <Stat label="DNS"      value={r.dnsMs != null ? `${r.dnsMs}ms` : "—"} />
                    <Stat label="SSL"      value={r.sslValid == null ? "—" : r.sslValid ? "✓" : "✗"} />
                  </div>
                )}

                <button
                  className={`btn-test-one${running ? " running" : ""}`}
                  disabled={running}
                  onClick={() => testOne(proxy)}
                  title="Test this proxy"
                >
                  {running
                    ? <span className="spinner-xs" />
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{width:13,height:13}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
