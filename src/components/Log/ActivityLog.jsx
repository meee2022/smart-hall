import { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { formatTime } from '../../utils/helpers';

/* ── Log type color mapping ── */
const LOG_COLORS = {
  info:    'var(--accent-cyan)',
  success: 'var(--accent-green)',
  warning: 'var(--status-yellow)',
  danger:  'var(--status-red)',
};

export default function ActivityLog() {
  const { t } = useI18n();

  const log      = useStore(s => s.log);
  const clearLog = useStore(s => s.clearLog);

  const listRef = useRef(null);

  /* Auto-scroll to top whenever new entries arrive */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [log.length]);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}
      >
        <div>
          <h1 className="section-title">{t('log.title', 'Activity Log')}</h1>
          <p className="section-subtitle">{t('log.sub', 'Real-time system event timeline')}</p>
        </div>
        {log.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearLog}>
            🗑️ {t('log.clear', 'Clear Log')}
          </button>
        )}
      </div>

      {/* ── Log Card ── */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'var(--bg-hover)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--accent-green)',
              boxShadow: '0 0 6px var(--accent-green)',
              display: 'inline-block',
              animation: 'pulse-dot 1.5s infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              LIVE — {log.length} {log.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          {log.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearLog} style={{ padding: '4px 10px' }}>
              Clear
            </button>
          )}
        </div>

        {/* Log list */}
        <div
          ref={listRef}
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            padding: '0 20px',
          }}
        >
          {log.length === 0 ? (
            /* Empty state */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '48px 24px', gap: '12px',
            }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>📋</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('log.empty', 'No activity yet. Interact with the system to see logs.')}
              </p>
            </div>
          ) : (
            log.map(entry => (
              <div
                key={entry.id}
                className={`log-entry ${entry.type}`}
              >
                {/* Timestamp */}
                <span className="log-time">
                  {formatTime(entry.timestamp)}
                </span>

                {/* Icon */}
                <span className="log-icon">{entry.icon}</span>

                {/* Message + type badge */}
                <div className="log-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{entry.message}</span>
                  <span
                    style={{
                      fontSize: '0.58rem',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: `${LOG_COLORS[entry.type] || 'var(--accent-cyan)'}18`,
                      color: LOG_COLORS[entry.type] || 'var(--accent-cyan)',
                      border: `1px solid ${LOG_COLORS[entry.type] || 'var(--accent-cyan)'}33`,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                    }}
                  >
                    {entry.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
