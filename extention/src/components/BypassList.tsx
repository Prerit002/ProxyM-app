import React from "react";
import type { BypassRule } from "@/types/proxy.types";

interface Props {
  rules: BypassRule[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const BypassList: React.FC<Props> = ({ rules, onRemove, onClear }) => (
  <section className="card">
    <div className="section-header">
      <div className="section-title">
        Bypass List
        <span className="section-count">{rules.length} Total</span>
      </div>
      {rules.length > 0 && (
        <div className="section-actions">
          <button className="btn-clear" onClick={onClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
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
            <th>Rule</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={4}>
                <div className="empty-content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
                  </svg>
                  <p>Add a rule above to get started.</p>
                </div>
              </td>
            </tr>
          ) : (
            rules.map((rule, i) => (
              <tr key={rule.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="row-dot idle" />
                    <span className="row-num">{i + 1}</span>
                  </div>
                </td>
                <td>
                  <span className="proxy-uri" style={{ cursor: "default" }}>{rule.pattern}</span>
                </td>
                <td>
                  <span className={`type-badge type-${rule.type}`}>
                    {rule.type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn edit" title="Edit (coming soon)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="action-btn del" title="Remove rule" onClick={() => onRemove(rule.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
