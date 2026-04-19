import { useCallback } from 'react'
import useStore from '../../store/useStore'
import { useI18n } from '../../hooks/useI18n'

// ── Navigation structure ─────────────────────────────────────
const NAV_GROUPS = [
  {
    groupKey: 'overview',
    items: [
      { id: 'overview',  icon: '📊', labelKey: 'nav.overview'  },
      { id: 'hall',      icon: '🏟️', labelKey: 'nav.hall',     badge: 'nav.badge.live' },
    ]
  },
  {
    groupKey: 'controls',
    items: [
      { id: 'screens',  icon: '📺', labelKey: 'nav.screens'  },
      { id: 'content',  icon: '🎬', labelKey: 'nav.content'  },
      { id: 'lighting', icon: '💡', labelKey: 'nav.lighting' },
      { id: 'court',    icon: '⚽', labelKey: 'nav.court'    },
    ]
  },
  {
    groupKey: 'automation',
    items: [
      { id: 'scenarios', icon: '🎯', labelKey: 'nav.scenarios' },
      { id: 'broadcast', icon: '📡', labelKey: 'nav.broadcast' },
    ]
  },
  {
    groupKey: 'monitoring',
    items: [
      { id: 'log',       icon: '📋', labelKey: 'nav.log'       },
      { id: 'analytics', icon: '📈', labelKey: 'nav.analytics' },
    ]
  },
]

const GROUP_LABELS = {
  overview:   { en: 'Overview',   ar: 'نظرة عامة'  },
  controls:   { en: 'Controls',   ar: 'التحكم'      },
  automation: { en: 'Automation', ar: 'الأتمتة'     },
  monitoring: { en: 'Monitoring', ar: 'المراقبة'    },
}

// ── Sidebar Component ────────────────────────────────────────
export default function Sidebar() {
  const { t, lang }     = useI18n()
  const activeSection   = useStore(state => state.activeSection)
  const setActiveTab = useStore(state => state.setActiveTab)
  const setActiveSection = useStore(state => state.setActiveSection)

  const handleNavClick = useCallback((sectionId) => {
    // Map section IDs to Hub Tab IDs
    let targetTab = 'overview'
    if (['overview', 'hall'].includes(sectionId)) targetTab = 'overview'
    else if (['screens', 'content', 'lighting', 'court'].includes(sectionId)) targetTab = 'controls'
    else if (['scenarios', 'broadcast'].includes(sectionId)) targetTab = 'automation'
    else if (['log', 'analytics'].includes(sectionId)) targetTab = 'monitoring'

    setActiveTab(targetTab)
    setActiveSection(sectionId)

    // Scroll to the specific element if it exists
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // If el doesn't exist (e.g. it's inside a tab), scroll to hub container
        document.querySelector('.hub-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)
  }, [setActiveTab, setActiveSection])

  return (
    <aside className="sidebar" style={styles.sidebar}>
      {/* ── Logo ── */}
      <div style={styles.logoArea}>
        <div style={styles.logoIconWrapper}>
          <span style={styles.logoHex}>⬡</span>
          <span style={styles.logoHexInner}>SA</span>
        </div>
        <div style={styles.logoText}>
          <div style={styles.logoTitle}>{t('logo.title')}</div>
          <div style={styles.logoSub}>{t('logo.sub')}</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={styles.nav}>
        {NAV_GROUPS.map(group => (
          <div key={group.groupKey} style={styles.navGroup}>
            <div style={styles.groupLabel}>
              {GROUP_LABELS[group.groupKey]?.[lang] ?? GROUP_LABELS[group.groupKey]?.en}
            </div>
            {group.items.map(item => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.navItemActive : {}),
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0,229,255,0.05)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                  title={t(item.labelKey)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={styles.navLabel}>{t(item.labelKey)}</span>
                  {item.badge && (
                    <span style={styles.liveBadge}>{t(item.badge)}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={styles.footer}>
        <div style={styles.footerDot} />
        <div>{t('footer.version')}</div>
        <div style={{ marginTop: 2, opacity: 0.6 }}>© {t('footer.copy')}</div>
      </div>
    </aside>
  )
}

// ── Styles ───────────────────────────────────────────────────
const styles = {
  sidebar: {
    width: '260px',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-subtle)',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  logoArea: {
    padding: '24px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  logoIconWrapper: {
    position: 'relative',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoHex: {
    fontSize: '2.4rem',
    color: '#00e5ff',
    lineHeight: 1,
    filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.6))',
    position: 'absolute',
  },
  logoHexInner: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.55rem',
    fontWeight: 700,
    color: '#00e5ff',
    letterSpacing: '0.04em',
    position: 'relative',
    zIndex: 1,
    marginTop: '2px',
  },
  logoText: {
    flex: 1,
    minWidth: 0,
  },
  logoTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.58rem',
    color: '#00e5ff',
    letterSpacing: '0.06em',
    marginTop: '2px',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  nav: {
    flex: 1,
    padding: '12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navGroup: {
    marginBottom: '8px',
  },
  groupLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '8px 4px 4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    borderLeft: '2px solid transparent',
    textAlign: 'left',
    fontFamily: 'var(--font-display)',
    fontSize: '0.88rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  navItemActive: {
    background: 'rgba(0,229,255,0.08)',
    color: '#00e5ff',
    borderLeft: '2px solid #00e5ff',
  },
  navIcon: {
    fontSize: '1rem',
    flexShrink: 0,
    width: '20px',
    textAlign: 'center',
  },
  navLabel: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  liveBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.52rem',
    padding: '2px 6px',
    borderRadius: '20px',
    background: 'rgba(0,255,136,0.15)',
    color: '#00ff88',
    border: '1px solid rgba(0,255,136,0.3)',
    letterSpacing: '0.06em',
    flexShrink: 0,
    animation: 'pulse-dot 1.5s infinite',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid var(--border-subtle)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.04em',
    flexShrink: 0,
    lineHeight: 1.6,
  },
  footerDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff88',
    display: 'inline-block',
    marginBottom: '4px',
    boxShadow: '0 0 6px rgba(0,255,136,0.6)',
  },
}
