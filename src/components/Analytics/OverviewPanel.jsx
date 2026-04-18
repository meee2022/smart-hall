import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';

export default function OverviewPanel() {
  const { t } = useI18n();

  const screens   = useStore(s => s.screens);
  const lighting  = useStore(s => s.lighting);
  const court     = useStore(s => s.court);
  const estimatePower = useStore(s => s.estimatePower);
  const getActiveScreenCount = useStore(s => s.getActiveScreenCount);

  const activeCount = getActiveScreenCount();
  const power       = estimatePower();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <h1 className="section-title">{t('ov.title', 'Overview')}</h1>
        <p className="section-subtitle">{t('ov.sub', 'System status at a glance')}</p>
      </div>

      {/* ── Hero Card ── */}
      <div
        className="card"
        style={{
          border: '1px solid rgba(0,229,255,0.3)',
          boxShadow: '0 0 30px rgba(0,229,255,0.08)',
          background: 'linear-gradient(135deg, #0d1520 0%, #111a2b 60%, #0d1520 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow orb */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--accent-cyan)',
              marginBottom: '8px',
            }}>
              {t('ov.hero.title', 'Smart Sports Arena')}
            </h2>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '520px',
            }}>
              {t('ov.hero.sub', 'A centralized control system for managing smart displays, dynamic court lighting, sport mode configurations, and automated event scenarios — all from one unified dashboard.')}
            </p>
          </div>

          {/* Status chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '20px',
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                {t('status.screens', 'Displays')}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                {activeCount}/4
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '20px',
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                {t('status.court', 'Court')}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#a855f7', fontSize: '0.85rem' }}>
                {t(court.mode)}
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: '20px',
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                {t('status.light', 'Lighting')}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.85rem' }}>
                {t(lighting.mode)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid-4">

        {/* Active Displays */}
        <div className="stat-card">
          <div className="stat-icon cyan">📺</div>
          <div className="stat-body">
            <div className="stat-label">{t('ov.stat.active', 'Active Displays')}</div>
            <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
              {activeCount}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/4</span>
            </div>
            <div className="stat-sub">{t('ov.stat.active.sub', 'of 4 total screens')}</div>
          </div>
        </div>

        {/* Court Mode */}
        <div className="stat-card">
          <div className="stat-icon purple">🏟️</div>
          <div className="stat-body">
            <div className="stat-label">{t('ov.stat.court', 'Court Mode')}</div>
            <div className="stat-value" style={{ fontSize: '1rem', color: '#a855f7' }}>
              {t(court.mode)}
            </div>
          </div>
        </div>

        {/* Light Intensity */}
        <div className="stat-card">
          <div className="stat-icon green">💡</div>
          <div className="stat-body">
            <div className="stat-label">{t('ov.stat.light', 'Light Intensity')}</div>
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
              {lighting.intensity}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
            </div>
            <div className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: lighting.color,
                  boxShadow: `0 0 6px ${lighting.color}`,
                }}
              />
              {t(lighting.mode)}
            </div>
          </div>
        </div>

        {/* Est. Power */}
        <div className="stat-card">
          <div className="stat-icon orange">⚡</div>
          <div className="stat-body">
            <div className="stat-label">{t('ov.stat.power', 'Est. Power Usage')}</div>
            <div className="stat-value" style={{ color: 'var(--status-orange)' }}>
              {power}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>w</span>
            </div>
            <div className="stat-sub">{t('ov.stat.power.sub', 'screens + lighting')}</div>
          </div>
        </div>

      </div>

      {/* ── Screen Status Quick View ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{t('ov.display.status', 'Display Status')}</div>
            <div className="card-subtitle">{t('ov.display.status.sub', 'Live status for all 4 displays')}</div>
          </div>
        </div>
        <div className="grid-4">
          {screens.map(screen => {
            const statusColor = {
              playing:   '#00ff88',
              on:        '#00e5ff',
              paused:    '#ffcc00',
              off:       '#ff3b5c',
              emergency: '#ff3b5c',
            }[screen.status] || '#7a9bb5';

            return (
              <div
                key={screen.id}
                style={{
                  background: 'var(--bg-hover)',
                  border: `1px solid ${statusColor}22`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                  }}>
                    {t(screen.name)}
                  </span>
                  <span className={`badge badge-${screen.status}`}>
                    <span className="badge-dot" />
                    {screen.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {screen.content
                    ? <><span>{screen.contentIcon}</span> {t(screen.content)}</>
                    : <span style={{ fontStyle: 'italic' }}>{t('screen.no.content', 'No content assigned')}</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
