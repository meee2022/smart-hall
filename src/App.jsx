import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'
import Modal from './components/UI/Modal'
import ToastContainer from './components/UI/ToastContainer'
import BroadcastOverlay from './components/UI/BroadcastOverlay'
import ScreenPreviewOverlay from './components/UI/ScreenPreviewOverlay'

import OverviewPanel from './components/Analytics/OverviewPanel'
import HallView from './components/Hall/HallView'
import ScreenPanel from './components/Screens/ScreenPanel'
import ContentLibrarySection from './components/Screens/ContentLibrary'
import LightingPanel from './components/Lighting/LightingPanel'
import CourtPanel from './components/Court/CourtPanel'
import ScenarioPanel from './components/Scenarios/ScenarioPanel'
import ActivityLog from './components/Log/ActivityLog'
import AnalyticsPanel from './components/Analytics/AnalyticsPanel'
import BroadcastPanel from './components/Broadcast/BroadcastPanel'

import useStore from './store/useStore'
import { useI18n } from './hooks/useI18n'
import { useStartupSound } from './hooks/useStartupSound'

const sectionVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function AppSection({ id, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={sectionVariants}
      style={{ padding: '32px 28px', borderBottom: '1px solid var(--border-subtle)', minHeight: '200px' }}
    >
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  )
}

export default function App() {
  useStartupSound()
  const { t, lang } = useI18n()
  const addLog = useStore(s => s.addLog)
  const closeModal = useStore(s => s.closeModal)
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const activeSection = useStore(s => s.activeSection)
  const setActiveSection = useStore(s => s.setActiveSection)
  const modalOpen = useStore(s => s.modal.open)
  const mainContentRef = useRef(null)

  const tabs = [
    { id: 'overview',   label: t('tab.overview'),   icon: '📊' },
    { id: 'controls',   label: t('tab.controls'),   icon: '🎮' },
    { id: 'automation', label: t('tab.automation'), icon: '🤖' },
    { id: 'monitoring', label: t('tab.monitoring'), icon: '📋' },
  ]

  useEffect(() => {
    const entries = [
      ['System initialized — Smart Arena Control v2.1.0', 'success', '🟢'],
      ['Screens 1 & 2 online — playing content', 'info', '📺'],
      ['Screen 3 resumed from pause', 'info', '▶️'],
      ['Lighting set to Training Mode (75%)', 'info', '💡'],
      ['Court configured as Multi-purpose', 'info', '🏟️'],
    ]
    entries.forEach(([msg, type, icon], i) => {
      setTimeout(() => addLog(msg, type, icon), i * 120)
    })
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && modalOpen) closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalOpen, closeModal])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content" ref={mainContentRef}>
        <TopBar />
        
        {/* ── Hero Arena View ── */}
        <section id="hall" className="hero-section">
          <div className="section-header">
            <h2 className="section-title">{t('hall.title')}</h2>
            <p className="section-subtitle">{t('hall.sub')}</p>
          </div>
          <HallView />
        </section>

        {/* ── Control Hub Container ── */}
        <div className="hub-container">
          {/* Tab Switcher */}
          <div className="hub-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`hub-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Set default section for the selected tab
                  const defaults = {
                    overview: 'overview',
                    controls: 'screens',
                    automation: 'scenarios',
                    monitoring: 'log'
                  };
                  setActiveSection(defaults[tab.id]);
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="hub-content" key={activeTab}>
            {activeTab === 'overview' && (
              <div id="overview" className="app-section-static">
                <OverviewPanel />
              </div>
            )}

            {activeTab === 'controls' && (
              <>
                {(activeSection === 'screens' || !['content', 'lighting', 'court'].includes(activeSection)) && (
                  <div id="screens" className="app-section-static">
                    <ScreenPanel />
                  </div>
                )}
                {activeSection === 'content' && (
                  <div id="content" className="app-section-static">
                    <ContentLibrarySection />
                  </div>
                )}
                {activeSection === 'lighting' && (
                  <div id="lighting" className="app-section-static">
                    <LightingPanel />
                  </div>
                )}
                {activeSection === 'court' && (
                  <div id="court" className="app-section-static">
                    <CourtPanel />
                  </div>
                )}
              </>
            )}

            {activeTab === 'automation' && (
              <>
                {(activeSection === 'scenarios' || activeSection !== 'broadcast') && (
                  <div id="scenarios" className="app-section-static">
                    <ScenarioPanel />
                  </div>
                )}
                {activeSection === 'broadcast' && (
                  <div id="broadcast" className="app-section-static">
                    <BroadcastPanel />
                  </div>
                )}
              </>
            )}

            {activeTab === 'monitoring' && (
              <>
                {(activeSection === 'log' || activeSection !== 'analytics') && (
                  <div id="log" className="app-section-static">
                    <ActivityLog />
                  </div>
                )}
                {activeSection === 'analytics' && (
                  <div id="analytics" className="app-section-static">
                    <AnalyticsPanel />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Modal />
      <ToastContainer />
      <BroadcastOverlay />
      <ScreenPreviewOverlay />
    </div>
  )
}
