import React, { useEffect, useState, useCallback } from "react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ProxyForm } from "@/components/ProxyForm";
import { ProxyList } from "@/components/ProxyList";
import { BypassForm } from "@/components/BypassForm";
import { BypassList } from "@/components/BypassList";
import { ProxyTester } from "@/components/ProxyTester";
import { AutoDetect } from "@/components/AutoDetect";
import { SmartRotation } from "@/components/SmartRotation";
import { getSettings, saveSettingsViaBackground } from "@/services/proxyService";
import type { AppSettings, Theme, RotationConfig, AutoDetectConfig } from "@/types/settings.types";
import { DEFAULT_SETTINGS } from "@/types/settings.types";
import type { ProxyEntry, BypassRule } from "@/types/proxy.types";

// ── Theme helpers ─────────────────────────────────────────
function applyTheme(theme: Theme) {
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};



// ── Component ─────────────────────────────────────────────
export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Apply theme whenever it changes
  useEffect(() => { applyTheme(settings.theme); }, [settings.theme]);

  useEffect(() => {
    getSettings().then((s) => {
      if (s) setSettings(s);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: AppSettings) => {
    setSaving(true); setSaveError(null);
    const resp = await saveSettingsViaBackground(next);
    if (!resp.success) setSaveError(resp.error ?? "Failed to save.");
    setSaving(false);
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => { const next = { ...prev, ...patch }; persist(next); return next; });
  }, [persist]);

  const toggleTheme = () => update({ theme: settings.theme === "light" ? "dark" : "light" });

  const handleUpdateRotation = useCallback((patch: Partial<RotationConfig>) => {
    update({ rotation: { ...settings.rotation, ...patch } });
  }, [settings.rotation, update]);

  const handleUpdateAutoDetect = useCallback((patch: Partial<AutoDetectConfig>) => {
    update({ autoDetect: { ...settings.autoDetect, ...patch } });
  }, [settings.autoDetect, update]);

  const [autoDetectRunning, setAutoDetectRunning] = useState(false);
  const handleRunAutoDetect = useCallback(async () => {
    setAutoDetectRunning(true);
    await new Promise<void>((resolve) => {
      chrome.runtime.sendMessage({ type: "AUTO_DETECT_ALL" }, (res) => {
        if (res?.success && res.data) {
          const results = res.data as Record<string, ProxyEntry["testResult"]>;
          setSettings((prev) => {
            const next = {
              ...prev,
              proxies: prev.proxies.map((p) => ({
                ...p,
                testResult: results[p.id] ?? p.testResult,
              })),
            };
            persist(next);
            return next;
          });
        }
        resolve();
      });
    });
    setAutoDetectRunning(false);
  }, [persist]);

  const handleAddProxy = useCallback((proxy: ProxyEntry) => {
    setSettings((prev) => {
      const proxies = [...prev.proxies, proxy];
      const activeProxyId = prev.activeProxyId ?? proxy.id;
      const next = { ...prev, proxies, activeProxyId };
      persist(next); return next;
    });
  }, [persist]);

  const handleRemoveProxy = useCallback((id: string) => {
    setSettings((prev) => {
      const proxies = prev.proxies.filter((p) => p.id !== id);
      const activeProxyId = prev.activeProxyId === id ? (proxies[0]?.id ?? null) : prev.activeProxyId;
      const next = { ...prev, proxies, activeProxyId };
      persist(next); return next;
    });
  }, [persist]);

  const handleSetActiveProxy = useCallback((id: string) => update({ activeProxyId: id }), [update]);
  const handleClearProxies   = useCallback(() => update({ proxies: [], activeProxyId: null }), [update]);

  const handleAddBypass = useCallback((rule: BypassRule) => {
    setSettings((prev) => { const next = { ...prev, bypassRules: [...prev.bypassRules, rule] }; persist(next); return next; });
  }, [persist]);

  const handleRemoveBypass = useCallback((id: string) => {
    setSettings((prev) => { const next = { ...prev, bypassRules: prev.bypassRules.filter((r) => r.id !== id) }; persist(next); return next; });
  }, [persist]);

  const handleClearBypass = useCallback(() => update({ bypassRules: [] }), [update]);

  if (loading) {
    return (
      <div id="app">
        <header className="header">
          <div className="header-left">
            <div className="header-logo"><img src="/icons/icon48.png" alt="ProxyM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
            <div><div className="header-title">ProxyM</div><div className="header-subtitle">Proxy Manager</div></div>
          </div>
        </header>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <span className="loading-text">Loading configuration…</span>
        </div>
      </div>
    );
  }

  return (
    <div id="app">
      {saveError && (
        <div className="global-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          {saveError}
        </div>
      )}

      <header className="header">
        <div className="header-left">
          <div className="header-logo"><img src="/icons/icon48.png" alt="ProxyM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
          <div>
            <div className="header-title">ProxyM</div>
            <div className="header-subtitle">Proxy Manager</div>
          </div>
        </div>
        <div className="header-right">
          {saving && <div className="save-pill"><span className="save-dot" />Saving</div>}
          <button className="theme-btn" onClick={toggleTheme} title={settings.theme === "dark" ? "Switch to Light" : "Switch to Dark"}>
            {THEME_ICONS[settings.theme === "dark" ? "light" : "dark"]}
          </button>
          <div className={`status-badge ${settings.enabled ? "on" : "off"}`}>
            <span className="status-dot" />
            {settings.enabled ? "Active" : "Inactive"}
          </div>
        </div>
      </header>

      <div className="content">
        <SettingsPanel settings={settings} onChange={update} />
        <ProxyTester
          proxies={settings.proxies}
          onResultsUpdate={(proxies) => {
            setSettings((prev) => {
              const next = { ...prev, proxies };
              persist(next);
              return next;
            });
          }}
        />
        <AutoDetect
          config={settings.autoDetect}
          onChange={handleUpdateAutoDetect}
          onRunNow={handleRunAutoDetect}
          running={autoDetectRunning}
        />
        <SmartRotation
          config={settings.rotation}
          onChange={handleUpdateRotation}
        />
        <ProxyForm onAdd={handleAddProxy} onAddMany={(proxies) => proxies.forEach(handleAddProxy)} />
        <ProxyList
          proxies={settings.proxies}
          activeProxyId={settings.activeProxyId}
          onRemove={handleRemoveProxy}
          onSetActive={handleSetActiveProxy}
          onClear={handleClearProxies}
        />
        <BypassForm onAdd={handleAddBypass} />
        <BypassList
          rules={settings.bypassRules}
          onRemove={handleRemoveBypass}
          onClear={handleClearBypass}
        />
      </div>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/icons/icon16.png" alt="ProxyM Logo" />
          Proxy Manager
        </div>
        <div className="footer-links">
          <a href="https://deepbypasser.net" target="_blank" rel="noopener noreferrer">Website</a>
          <span>•</span>
          <a href="https://deepbypasser.net/proxym" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};
