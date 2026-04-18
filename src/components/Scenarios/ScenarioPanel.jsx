import { useState } from 'react';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { SCENARIOS } from '../../data/scenarios';
import { ContentLibrary } from '../../data/contentLibrary';

/* ── Activation progress steps ──────────────────────────────────── */
const STEPS = [
  { key: 'court',   label: 'sc.step.court',    icon: '🏟️', delay: 0   },
  { key: 'light',   label: 'sc.step.lighting',  icon: '💡', delay: 400 },
  { key: 'screens', label: 'sc.step.screens',   icon: '📺', delay: 800 },
  { key: 'sync',    label: 'sc.step.sync',      icon: '🔗', delay: 1200 },
  { key: 'done',    label: 'sc.step.done',      icon: '✅', delay: 1600 },
];

/* ── Confirm & Activate Modal ───────────────────────────────────── */
function ScenarioModal({ scenario, closeModal }) {
  const { t } = useI18n();

  const [activating, setActivating]     = useState(false);
  const [currentStep, setCurrentStep]   = useState(-1);
  const [doneSteps,   setDoneSteps]     = useState([]);

  const setCourtMode     = useStore(s => s.setCourtMode);
  const setLightingMode  = useStore(s => s.setLightingMode);
  const setScreenContent = useStore(s => s.setScreenContent);
  const syncScreens      = useStore(s => s.syncScreens);
  const setScenarioActive = useStore(s => s.setScenarioActive);
  const addLog           = useStore(s => s.addLog);
  const addToast         = useStore(s => s.addToast);

  const runActivation = () => {
    setActivating(true);
    setCurrentStep(0);

    /* Step 0 — court mode (0ms) */
    setTimeout(() => {
      setCourtMode(scenario.courtMode);
      setDoneSteps(prev => [...prev, 'court']);
      setCurrentStep(1);
    }, 0);

    /* Step 1 — lighting (400ms) */
    setTimeout(() => {
      setLightingMode(scenario.lightingMode, scenario.lightColor, scenario.lightIntensity);
      setDoneSteps(prev => [...prev, 'light']);
      setCurrentStep(2);
    }, 400);

    /* Step 2 — screen assignments (800ms) */
    setTimeout(() => {
      scenario.screenAssignments.forEach(({ screenId, contentId }) => {
        setScreenContent(screenId, contentId);
      });
      setDoneSteps(prev => [...prev, 'screens']);
      setCurrentStep(3);
    }, 800);

    /* Step 3 — sync (1200ms) */
    setTimeout(() => {
      syncScreens();
      setDoneSteps(prev => [...prev, 'sync']);
      setCurrentStep(4);
    }, 1200);

    /* Step 4 — done (1600ms) */
    setTimeout(() => {
      setDoneSteps(prev => [...prev, 'done']);
      setScenarioActive(scenario.name);
      addLog(`Scenario "${scenario.name}" activated`, 'success', scenario.emoji);
      addToast('Scenario Active', scenario.name, 'success');
      setTimeout(closeModal, 400);
    }, 1600);
  };

  const progress = doneSteps.length === 0 ? 0 : Math.round((doneSteps.length / STEPS.length) * 100);

  /* ── Assignment lookup ── */
  const getItemName = (contentId) => {
    const item = ContentLibrary.getItemById(contentId);
    return item ? <>{item.icon} {t(item.name)}</> : contentId;
  };
  const screenNames = ['North', 'South', 'East', 'West'];

  return (
    <div>
      <div className="modal-header">
        <div>
          <div className="modal-title" style={{ color: scenario.color }}>
            {scenario.emoji} {t(scenario.name)}
          </div>
          <div className="modal-subtitle">{t('sc.confirm.title', 'Activate this smart scenario?')}</div>
        </div>
        {!activating && (
          <button className="modal-close" onClick={closeModal}>✕</button>
        )}
      </div>

      {activating ? (
        /* ── Progress view ── */
        <div className="scenario-activating" style={{ padding: '24px 8px' }}>
          <div className="activating-spinner" />
          <div className="activating-text" style={{ color: scenario.color }}>
            {t('sc.activating', 'ACTIVATING')}
          </div>
          <div style={{ width: '100%' }}>
            <div className="progress-bar" style={{ width: '100%', marginBottom: '16px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${scenario.color}, ${scenario.color}88)`,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {STEPS.map((step, i) => {
                const isDone    = doneSteps.includes(step.key);
                const isCurrent = currentStep === i && !isDone;
                return (
                  <div
                    key={step.key}
                    className="activating-steps"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      color: isDone
                        ? scenario.color
                        : isCurrent
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                      transition: 'color 0.3s',
                    }}
                  >
                    <span>{isDone ? '✅' : isCurrent ? '⟳' : step.icon}</span>
                    <span>{t(step.label, step.label)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── Details view ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {t('sc.' + scenario.id + '.desc', scenario.description)}
          </p>

          {/* Court + Lighting info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{
              padding: '12px', background: 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                {t('sc.court.label', 'COURT MODE')}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: scenario.color, fontSize: '0.85rem' }}>
                {scenario.courtMode === 'Football' ? '⚽' : '🏟️'} {t(scenario.courtMode)}
              </div>
            </div>
            <div style={{
              padding: '12px', background: 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                {t('sc.lighting.label', 'LIGHTING')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: scenario.lightColor,
                  boxShadow: `0 0 6px ${scenario.lightColor}`,
                }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: scenario.lightColor, fontSize: '0.85rem' }}>
                  {t(scenario.lightingMode)}
                </span>
              </div>
            </div>
          </div>

          {/* Screen Assignments */}
          <div>
            <div style={{
              fontSize: '0.62rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: '8px',
            }}>
              {t('sc.assignments.label', 'SCREEN ASSIGNMENTS')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scenario.screenAssignments.map(({ screenId, contentId }) => (
                <div
                  key={screenId}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'var(--bg-hover)',
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    {t(screenNames[screenId - 1] + ' Display')}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {getItemName(contentId)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="scenario-tags">
            {scenario.tags.map(tag => (
              <span
                key={tag}
                className="scenario-tag"
                style={{ color: scenario.color, borderColor: `${scenario.color}44` }}
              >
                {t(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {!activating && (
        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('modal.cancel', 'Cancel')}</button>
          <button
            className="btn btn-primary btn-md"
            style={{
              background: `${scenario.color}22`,
              color: scenario.color,
              border: `1px solid ${scenario.color}55`,
            }}
            onClick={runActivation}
          >
            ▶ {t('sc.activate.btn', 'Activate Scenario')}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main ScenarioPanel ─────────────────────────────────────────── */
export default function ScenarioPanel() {
  const { t } = useI18n();

  const scenario      = useStore(s => s.scenario);
  const clearScenario = useStore(s => s.clearScenario);
  const addLog        = useStore(s => s.addLog);
  const addToast      = useStore(s => s.addToast);
  const openModal     = useStore(s => s.openModal);
  const closeModal    = useStore(s => s.closeModal);

  const handleOpenScenario = (sc) => {
    openModal(<ScenarioModal scenario={sc} closeModal={closeModal} />);
  };

  const handleClear = () => {
    clearScenario();
    addLog('Active scenario cleared', 'info', '🗑️');
    addToast('Scenario Cleared', 'No active scenario', 'info');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="section-title">{t('scenarios.title', 'Smart Scenarios')}</h1>
          <p className="section-subtitle">{t('scenarios.sub', 'One-click automation — applies court mode, lighting, and content simultaneously')}</p>
        </div>
        {scenario.active && (
          <button className="btn btn-danger btn-sm" onClick={handleClear}>
            🗑️ {t('scenarios.clear', 'Clear Active')}
          </button>
        )}
      </div>

      {/* ── Active Scenario Banner ── */}
      {scenario.active && (() => {
        const activeSc = SCENARIOS.find(s => s.name === scenario.active);
        return activeSc ? (
          <div
            className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
              background: `${activeSc.color}0d`,
              border: `1px solid ${activeSc.color}44`,
              boxShadow: `0 0 20px ${activeSc.glow}`,
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>{activeSc.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1rem', color: activeSc.color, textTransform: 'uppercase',
              }}>
                {t(activeSc.name)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t('sc.' + activeSc.id + '.desc', activeSc.description)}
              </div>
            </div>
            <span className="badge" style={{
              background: `${activeSc.color}18`,
              color: activeSc.color,
              border: `1px solid ${activeSc.color}44`,
            }}>
              ● {t('badge.active', 'ACTIVE')}
            </span>
          </div>
        ) : null;
      })()}

      {/* ── Scenario Cards Grid ── */}
      <div className="grid-3">
        {SCENARIOS.map(sc => {
          const isActive = scenario.active === sc.name;
          return (
            <button
              key={sc.id}
              className={`scenario-btn ${isActive ? 'active-scenario' : ''}`}
              style={{
                '--scenario-color': sc.color,
                '--scenario-glow': sc.glow,
                textAlign: 'left',
              }}
              onClick={() => handleOpenScenario(sc)}
            >
              {/* Active badge overlay */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                }}>
                  <span className="badge" style={{
                    background: `${sc.color}22`,
                    color: sc.color,
                    border: `1px solid ${sc.color}55`,
                  }}>
                    ● {t('badge.active', 'ACTIVE')}
                  </span>
                </div>
              )}

              <div className="scenario-emoji">{sc.emoji}</div>
              <div className="scenario-name" style={{ color: isActive ? sc.color : 'var(--text-primary)' }}>
                {t(sc.name)}
              </div>
              <div className="scenario-desc">{t('sc.' + sc.id + '.desc', sc.description)}</div>
              <div className="scenario-tags">
                {sc.tags.map(tag => (
                  <span
                    key={tag}
                    className="scenario-tag"
                    style={{ color: sc.color, borderColor: `${sc.color}44` }}
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
