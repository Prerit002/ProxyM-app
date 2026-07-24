import React from "react";
import type { ProxyEntry } from "@/types/proxy.types";
import { formatProxyDisplay } from "@/utils/formatProxy";

interface Props {
  proxies: ProxyEntry[];
  activeProxyId: string | null;
  onRemove: (id: string) => void;
  onSetActive: (id: string) => void;
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}


export const ProxyList: React.FC<Props> = ({ proxies, activeProxyId, onRemove, onSetActive, onClear }) => (
  <section className="card">
    <div className="section-header">
      <div className="section-title">
        Proxy List
        <span className="section-count">{proxies.length} Total</span>
      </div>
      {proxies.length > 0 && (
        <div className="section-actions">
          <button className="btn-clear" onClick={onClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
            Clear
          </button>
        </div>
      )}
    </div>

    <div className="proxy-table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Proxy</th>
            <th>Protocol</th>
            <th>Host</th>
            <th>Port</th>
            <th>Auth</th>
            <th>Last Used</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proxies.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={8}>
                <div className="empty-content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <rect x="2" y="3" width="20" height="5" rx="1.5"/>
                    <rect x="2" y="10" width="20" height="5" rx="1.5"/>
                    <rect x="2" y="17" width="20" height="5" rx="1.5"/>
                  </svg>
                  <p>Add a proxy above to get started.</p>
                </div>
              </td>
            </tr>
          ) : (
            proxies.map((proxy, i) => {
              const isActive = proxy.id === activeProxyId;
              return (
                <tr key={proxy.id} className={isActive ? "row-active" : ""}
                  onClick={() => onSetActive(proxy.id)} style={{ cursor: "pointer" }}
                  title="Click to set as active proxy"
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className={`row-dot ${isActive ? "active" : "idle"}`} />
                      <span className="row-num">{i + 1}</span>
                    </div>
                  </td>
                  <td>
                    <span className="proxy-uri">{formatProxyDisplay(proxy)}</span>
                  </td>
                  <td>
                    <span className={`proto-badge proto-${proxy.protocol}`}>
                      {proxy.protocol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{proxy.host}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{proxy.port}</td>
                  <td>
                    {proxy.username ? (
                      <svg className="auth-icon yes" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ) : (
                      <svg className="auth-icon no" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                      </svg>
                    )}
                  </td>
                  <td>
                    <span className="last-used">
                      {proxy.lastUsed ? timeAgo(proxy.lastUsed) : "—"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns" onClick={(e) => e.stopPropagation()}>
                      <button className="action-btn edit" title="Edit (coming soon)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="action-btn del" title="Remove proxy" onClick={() => onRemove(proxy.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </section>
);
