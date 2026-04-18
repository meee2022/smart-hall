import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { formatUptime } from '../../utils/helpers';

/* ── Single stat card for the analytics grid ── */
function AnalyticCard({ icon, iconClass, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const { t } = useI18n();

  const screens  = useStore(s => s.screens);
  const lighting = useStore(s => s.lighting);
  const court    = useStore(s => s.court);
  const scenario = useStore(s => s.scenario);
  const system   = useStore(s => s.system);
  const getActiveScreenCount = useStore(s => s.getActiveScreenCount);
  const isSynced             = useStore(s => s.isSynced);
  const estimatePower        = useStore(s => s.estimatePower);

  /* Auto-updating uptime */
  const [uptime, setUptime] = useState(Date.now() - system.startTime);
  useEffect(() => {
    const id = setInterval(() => setUptime(Date.now() - system.startTime), 1000);
    return () => clearInterval(id);
  }, [system.startTime]);

  const activeCount = getActiveScreenCount();
  const synced      = isSynced();
  const power       = estimatePower();
  const lastSync    = new Date(system.lastUpdated).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <h1 className="section-title">{t('analytics.title', 'Analytics & System Status')}</h1>
        <p className="section-subtitle">{t('analytics.sub', 'Live system metrics and performance indicators')}</p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid-4" style={{ rowGap: '16px' }}>

        <AnalyticCard
          icon="📺"
          iconClass="cyan"
          label={t('an.active.label', 'Active Screens')}
          value={<>{activeCount}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/4</span></>}
          sub={t('an.active.sub', 'real-time status')}
        />

        <AnalyticCard
          icon="🏟️"
          iconClass="purple"
          label={t('an.court.label', 'Court Configuration')}
          value={<span style={{ fontSize: '0.95rem', color: '#a855f7' }}>{t(court.mode)}</span>}
          sub={t('an.court.sub', 'current layout')}
        />

        <AnalyticCard
          icon="💡"
          iconClass="green"
          label={t('an.light.label', 'Lighting Preset')}
          value={<span style={{ fontSize: '0.95rem', color: 'var(--accent-green)' }}>{t(lighting.mode)}</span>}
          sub={`${lighting.intensity}% intensity`}
        />

        <AnalyticCard
          icon="🎬"
          iconClass="orange"
          label={t('an.scenario.label', 'Active Scenario')}
          value={
            <span style={{ fontSize: '0.95rem', color: scenario.active ? 'var(--status-orange)' : 'var(--text-muted)' }}>
              {scenario.active ? t(scenario.active) : t('none', 'None')}
            </span>
          }
          sub={t('an.scenario.sub', 'automation state')}
        />

        <AnalyticCard
          icon="⚡"
          iconClass="orange"
          label={t('an.power.label', 'Est. Power Draw')}
          value={<>{power}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>w</span></>}
          sub={t('an.power.sub', 'screens + lighting')}
        />

        <AnalyticCard
          icon="⏱️"
          iconClass="cyan"
          label={t('an.uptime.label', 'System Uptime')}
          value={<span style={{ fontSize: '0.95rem' }}>{formatUptime(uptime)}</span>}
          sub={t('an.uptime.sub', 'since page load')}
        />

        <AnalyticCard
          icon="🔗"
          iconClass={synced ? 'green' : 'yellow'}
          label={t('an.synced.label', 'Screens Synced')}
          value={
            <span style={{ fontSize: '0.95rem', color: synced ? 'var(--accent-green)' : 'var(--status-yellow)' }}>
              {synced ? t('synced.yes', 'Yes') : t('synced.no', 'No')}
            </span>
          }
          sub={t('an.synced.sub', 'same content on all')}
        />

        <AnalyticCard
          icon="✅"
          iconClass="green"
          label={t('an.health.label', 'System Health')}
          value={<span style={{ fontSize: '0.95rem', color: 'var(--accent-green)' }}>{t('an.health.val', 'OK')}</span>}
          sub={t('an.health.sub', 'all systems nominal')}
        />

      </div>

      {/* ── Screen-by-Screen breakdown ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('Display Status Breakdown')}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {screens.map(screen => {
            const statusColor = {
              playing: '#00ff88', on: '#00e5ff', paused: '#ffcc00',
              off: '#ff3b5c', emergency: '#ff3b5c',
            }[screen.status] || '#7a9bb5';

            return (
              <div
                key={screen.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px',
                  background: 'var(--bg-hover)',
                  border: `1px solid ${statusColor}22`,
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                  background: `${statusColor}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {screen.contentIcon || '📺'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {t(screen.name)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {screen.content ? t(screen.content) : t('No content')}
                    {screen.group && <span style={{ marginLeft: '8px', color: 'var(--accent-cyan)', fontSize: '0.62rem' }}>{t('Group:')} {screen.group}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`badge badge-${screen.status === 'emergency' ? 'off' : screen.status}`}>
                    <span className="badge-dot" />
                    {screen.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    180w
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── System Information ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('an.sysinfo.title', 'System Information')}</div>
          <span className="badge badge-playing">
            <span className="badge-dot" />
            {t('system.online', 'SYSTEM ONLINE')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: t('an.platform', 'Platform'),    value: t('an.platform.val', 'Smart Arena OS v2.1.0'), icon: '🖥️' },
            { label: t('an.controller', 'Controller'), value: t('an.controller.val', 'Central Control Unit'), icon: '🎛️' },
            { label: t('an.network', 'Network'),       value: t('an.network.val', 'Connected — LAN 1Gbps'), icon: '🌐' },
            { label: t('an.displays.label', 'Displays'), value: t('an.displays.val', '4x Samsung QB98R 4K'), icon: '📺' },
            { label: t('an.led', 'LED Floor'),         value: t('an.led.val', 'Smart LED Array 2560 nodes'), icon: '💡' },
            { label: t('Last Sync'),                      value: lastSync, icon: '🔄' },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                padding: '12px 14px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{
                fontSize: '0.62rem', color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                letterSpacing: '0.06em', marginBottom: '4px',
              }}>
                {icon} {label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
