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
  const { t, lang } = useI18n()
  const addLog = useStore(s => s.addLog)
  const closeModal = useStore(s => s.closeModal)
  const setActiveSection = useStore(s => s.setActiveSection)
  const modalOpen = useStore(s => s.modal.open)
  const mainContentRef = useRef(null)
  const sectionIds = ['overview','hall','screens','content','lighting','court','scenarios','broadcast','log','analytics']

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
    const observers = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: [0.15], root: mainContentRef.current }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [setActiveSection])

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
        <div style={{ paddingBottom: '60px' }}>
          <AppSection id="overview" title={t('ov.title')} subtitle={t('ov.sub')}>
            <OverviewPanel />
          </AppSection>
          <AppSection id="hall" title={t('hall.title')} subtitle={t('hall.sub')}>
            <HallView />
          </AppSection>
          <AppSection id="screens" title={t('screens.title')} subtitle={t('screens.sub')}>
            <ScreenPanel />
          </AppSection>
          <AppSection id="content" title={t('content.title')} subtitle={t('content.sub')}>
            <ContentLibrarySection />
          </AppSection>
          <AppSection id="lighting" title={t('lighting.title')} subtitle={t('lighting.sub')}>
            <LightingPanel />
          </AppSection>
          <AppSection id="court" title={t('court.title')} subtitle={t('court.sub')}>
            <CourtPanel />
          </AppSection>
          <AppSection id="scenarios" title={t('scenarios.title')} subtitle={t('scenarios.sub')}>
            <ScenarioPanel />
          </AppSection>
          <AppSection id="broadcast" title={lang === 'ar' ? 'البث المباشر' : 'Broadcast Display'} subtitle={lang === 'ar' ? 'اعرض إعلانات وبث كبير على شاشة كاملة' : 'Show announcements and broadcasts on a fullscreen display'}>
            <BroadcastPanel />
          </AppSection>
          <AppSection id="log" title={t('log.title')} subtitle={t('log.sub')}>
            <ActivityLog />
          </AppSection>
          <AppSection id="analytics" title={t('analytics.title')} subtitle={t('analytics.sub')}>
            <AnalyticsPanel />
          </AppSection>
        </div>
      </div>
      <Modal />
      <ToastContainer />
      <BroadcastOverlay />
      <ScreenPreviewOverlay />
    </div>
  )
}
