import { useEffect, useState, useCallback } from 'react'
import useStore from '../../store/useStore'
import { useI18n } from '../../hooks/useI18n'

// ── Clock ────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(date, lang) {
  return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  })
}

// ── Status Chip ──────────────────────────────────────────────
function StatusChip({ dotColor, label, value, valueColor }) {
  return (
    <div style={styles.chip}>
      <span style={{ ...styles.chipDot, background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
      <span style={styles.chipLabel}>{label}</span>
      {value !== undefined && (
        <span style={{ ...styles.chipValue, color: valueColor || 'var(--text-primary)' }}>
          {value}
        </span>
      )}
    </div>
  )
}

// ── Quick Action Button ──────────────────────────────────────
function QAButton({ label, onClick, variant = 'default' }) {
  const variantStyle = QA_VARIANTS[variant] || QA_VARIANTS.default
  return (
    <button
      style={{ ...styles.qaBtn, ...variantStyle }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
    >
      {label}
    </button>
  )
}

const QA_VARIANTS = {
  default:   { background: 'rgba(0,229,255,0.1)',   color: '#00e5ff',  border: '1px solid rgba(0,229,255,0.2)'   },
  success:   { background: 'rgba(0,255,136,0.1)',   color: '#00ff88',  border: '1px solid rgba(0,255,136,0.2)'   },
  danger:    { background: 'rgba(255,59,92,0.12)',   color: '#ff3b5c',  border: '1px solid rgba(255,59,92,0.25)'   },
  warning:   { background: 'rgba(255,204,0,0.1)',   color: '#ffcc00',  border: '1px solid rgba(255,204,0,0.2)'   },
  sport:     { background: 'rgba(168,85,247,0.1)',  color: '#a855f7',  border: '1px solid rgba(168,85,247,0.2)'  },
  health:    { background: 'rgba(0,255,136,0.08)',  color: '#00ff88',  border: '1px solid rgba(0,255,136,0.15)'  },
  demo:      { background: 'rgba(255,107,53,0.1)',  color: '#ff6b35',  border: '1px solid rgba(255,107,53,0.2)'  },
}

// ── TopBar Component ─────────────────────────────────────────
export default function TopBar() {
  const { t, lang } = useI18n()
  const clock = useClock()

  // Store state
  const screens        = useStore(state => state.screens)
  const lighting       = useStore(state => state.lighting)
  const court          = useStore(state => state.court)
  const theme          = useStore(state => state.theme)
  const system         = useStore(state => state.system)

  // Store actions
  const setTheme       = useStore(state => state.setTheme)
  const setLang        = useStore(state => state.setLang)
  const powerAll       = useStore(state => state.powerAll)
  const stopAll        = useStore(state => state.stopAll)
  const syncScreens    = useStore(state => state.syncScreens)
  const setCourtMode   = useStore(state => state.setCourtMode)
  const setLightingMode = useStore(state => state.setLightingMode)
  const emergencyMode  = useStore(state => state.emergencyMode)
  const addLog         = useStore(state => state.addLog)
  const addToast       = useStore(state => state.addToast)
  const setScenarioActive    = useStore(state => state.setScenarioActive)
  const setScenarioActivating = useStore(state => state.setScenarioActivating)
  const setAllScreensContent = useStore(state => state.setAllScreensContent)

  // Computed
  const activeCount = screens.filter(s => s.status !== 'off').length

  // ── Quick Action Handlers ──
  const handlePowerAll = useCallback(() => {
    powerAll()
    addLog('All screens powered on', 'success', '⚡')
    addToast(t('qa.power'), 'All 4 screens are now active', 'success')
  }, [powerAll, addLog, addToast, t])

  const handleSyncAll = useCallback(() => {
    syncScreens()
    addLog('All screens synchronized to same content', 'success', '🔄')
    addToast(t('qa.sync'), 'Screens are now showing the same content', 'info')
  }, [syncScreens, addLog, addToast, t])

  const handleStopAll = useCallback(() => {
    stopAll()
    addLog('All screens stopped and powered off', 'warning', '⏹️')
    addToast(t('qa.stop'), 'All screens have been stopped', 'warning')
  }, [stopAll, addLog, addToast, t])

  const handleFootball = useCallback(() => {
    setCourtMode('Football')
    setLightingMode('Match Mode', '#00e5ff', 100)
    addLog('Court mode set to Football — Match Mode activated', 'success', '⚽')
    addToast(t('qa.football'), 'Football mode + Match lighting activated', 'success')
  }, [setCourtMode, setLightingMode, addLog, addToast, t])

  const handleVolleyball = useCallback(() => {
    setCourtMode('Volleyball')
    setLightingMode('Training Mode', '#00ff88', 80)
    addLog('Court mode set to Volleyball — Training Mode activated', 'success', '🏐')
    addToast(t('qa.volleyball'), 'Volleyball mode + Training lighting activated', 'success')
  }, [setCourtMode, setLightingMode, addLog, addToast, t])

  const handleHealth = useCallback(() => {
    setCourtMode('Multi-purpose')
    setLightingMode('Health Awareness', '#00ff88', 70)
    addLog('Health Awareness campaign started', 'info', '💚')
    addToast(t('qa.health'), 'Health Awareness mode activated', 'info')
  }, [setCourtMode, setLightingMode, addLog, addToast, t])

  const handleEmergency = useCallback(() => {
    emergencyMode()
    addLog('EMERGENCY MODE ACTIVATED — All screens show safety guidance', 'danger', '🚨')
    addToast('EMERGENCY', 'Emergency protocol active on all screens', 'danger')
  }, [emergencyMode, addLog, addToast])

  const handleDemo = useCallback(() => {
    setCourtMode('Multi-purpose')
    setLightingMode('Presentation Mode', '#a855f7', 85)
    powerAll()
    setScenarioActivating(true)
    setTimeout(() => {
      setScenarioActive('Full Demo Mode')
      setScenarioActivating(false)
    }, 2000)
    addLog('Full Demo Mode initiated — showcasing all features', 'info', '🎬')
    addToast(t('qa.demo'), 'Full system demo activated', 'info')
  }, [setCourtMode, setLightingMode, powerAll, setScenarioActive, setScenarioActivating, addLog, addToast, t])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('light', next === 'light')
    addLog(`Theme switched to ${next} mode`, 'info', next === 'dark' ? '🌙' : '☀️')
  }, [theme, setTheme, addLog])

  const toggleLang = useCallback(() => {
    const next = lang === 'en' ? 'ar' : 'en'
    setLang(next)
    addLog(`Language switched to ${next === 'ar' ? 'Arabic' : 'English'}`, 'info', '🌐')
  }, [lang, setLang, addLog])

  return (
    <header style={styles.topBar}>
      {/* ── Main Bar ── */}
      <div style={styles.mainBar}>
        {/* Left: Status chips */}
        <div style={styles.statusRow}>
          <StatusChip
            dotColor="#00ff88"
            label={t('status.online')}
          />
          <div style={styles.divider} />
          <StatusChip
            dotColor={activeCount > 0 ? '#00e5ff' : '#ff3b5c'}
            label={t('status.screens')}
            value={`${activeCount}/4`}
            valueColor={activeCount > 0 ? '#00e5ff' : '#ff3b5c'}
          />
          <div style={styles.divider} />
          <StatusChip
            dotColor="#a855f7"
            label={t('status.court')}
            value={court.split ? `${court.leftMode} | ${court.rightMode}` : court.mode}
            valueColor="#a855f7"
          />
          <div style={styles.divider} />
          <StatusChip
            dotColor="#ffcc00"
            label={t('status.light')}
            value={lighting.mode}
            valueColor="#ffcc00"
          />
        </div>

        {/* Right: Clock + controls */}
        <div style={styles.rightControls}>
          <div style={styles.clockBlock}>
            <div style={styles.clockTime}>{formatTime(clock)}</div>
            <div style={styles.clockDate}>{formatDate(clock, lang)}</div>
          </div>

          <button
            style={styles.iconBtn}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            style={styles.langBtn}
            onClick={toggleLang}
            title="Toggle language / تبديل اللغة"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'ع' : 'EN'}
          </button>
        </div>
      </div>

      {/* ── Quick Actions Bar ── */}
      <div className="quick-actions">
        <span className="qa-label">Quick:</span>
        <QAButton label={t('qa.power')}      onClick={handlePowerAll}  variant="success"  />
        <QAButton label={t('qa.sync')}       onClick={handleSyncAll}   variant="default"  />
        <QAButton label={t('qa.stop')}       onClick={handleStopAll}   variant="danger"   />
        <div style={styles.qaDivider} />
        <QAButton label={t('qa.football')}   onClick={handleFootball}  variant="sport"    />
        <QAButton label={t('qa.volleyball')} onClick={handleVolleyball} variant="sport"   />
        <QAButton label={t('qa.health')}     onClick={handleHealth}    variant="health"   />
        <div style={styles.qaDivider} />
        <QAButton label={t('qa.emergency')}  onClick={handleEmergency} variant="danger"   />
        <QAButton label={t('qa.demo')}       onClick={handleDemo}      variant="demo"     />

        {/* System uptime micro-indicator */}
        <div style={styles.uptimeChip}>
          <span style={styles.uptimeDot} />
          {formatUptime(system.startTime)}
        </div>
      </div>
    </header>
  )
}

// ── Helpers ──────────────────────────────────────────────────
function formatUptime(startTime) {
  const s = Math.floor((Date.now() - startTime) / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

// ── Styles ───────────────────────────────────────────────────
const styles = {
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  mainBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.68rem',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.04em',
  },
  chipDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
    animation: 'pulse-dot 2s infinite',
  },
  chipLabel: {
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
  },
  chipValue: {
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
  divider: {
    width: '1px',
    height: '16px',
    background: 'var(--border-subtle)',
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
  },
  clockBlock: {
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
  },
  clockTime: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#00e5ff',
    letterSpacing: '0.08em',
    lineHeight: 1.2,
  },
  clockDate: {
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    lineHeight: 1,
  },
  iconBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 150ms ease',
  },
  langBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-normal)',
    borderRadius: '8px',
    padding: '0 10px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#00e5ff',
    transition: 'all 150ms ease',
    letterSpacing: '0.04em',
  },
  qaBtn: {
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.68rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap',
  },
  qaDivider: {
    width: '1px',
    height: '18px',
    background: 'var(--border-subtle)',
    flexShrink: 0,
  },
  uptimeChip: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
    paddingLeft: '8px',
  },
  uptimeDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#00ff88',
    flexShrink: 0,
  },
}
