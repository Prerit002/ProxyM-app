import React from "react";
import type { AppSettings } from "@/types/settings.types";
import { formatProxyDisplay } from "@/utils/formatProxy";

interface Props { settings: AppSettings; }

const PROTO_CLASS: Record<string, string> = {
  http: "proto-http", https: "proto-https",
  socks4: "proto-socks4", socks5: "proto-socks5",
};

export const CurrentConnection: React.FC<Props> = ({ settings }) => {
  const proxy = settings.proxies.find((p) => p.id === settings.activeProxyId);
  const isActive = settings.enabled && !!proxy;

  return (
    <div className={`connection-card${isActive ? " active" : ""}`}>
      <div className="connection-body">
        <div className={`connection-icon-wrap${isActive ? " active" : " idle"}`}>
          {isActive ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )}
        </div>

        <div className="connection-meta">
          <div className="connection-status-row">
            <span className="connection-status-label">
              {isActive ? "Active Connection" : "No Connection"}
            </span>
            {isActive && proxy && (
              <span className={`proto-pill ${PROTO_CLASS[proxy.protocol] ?? ""}`}>
                {proxy.protocol}
              </span>
            )}
          </div>

          {isActive && proxy ? (
            <>
              <div className="connection-value active">{formatProxyDisplay(proxy)}</div>
              <div className="connection-sub">
                Traffic routed via {proxy.protocol.toUpperCase()} · {proxy.host}:{proxy.port}
              </div>
            </>
          ) : (
            <>
              <div className="connection-value idle">Direct connection</div>
              <div className="connection-sub">
                {settings.proxies.length === 0
                  ? "Add a proxy below to get started"
                  : "Enable proxy manager to start routing"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
