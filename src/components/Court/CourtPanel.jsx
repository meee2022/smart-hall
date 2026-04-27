import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { COURT_MODES } from '../../data/courtModes';

export default function CourtPanel() {
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';

  const court = useStore(s => s.court);
  const setCourtMode = useStore(s => s.setCourtMode);
  const setCourtLayout = useStore(s => s.setCourtLayout);
  const setCourtSplitModes = useStore(s => s.setCourtSplitModes);
  const setCourtQuarterMode = useStore(s => s.setCourtQuarterMode);
  const addLog = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);

  const handleSetMode = (mode) => {
    setCourtMode(mode.name);
    addLog(`Court → ${mode.name}`, 'success', '🏟️');
    addToast(isAr ? 'وضع الملعب' : 'Court Mode', `${mode.icon} ${mode.name}`, 'success');
  };

  const handleLayoutChange = (layout) => {
    setCourtLayout(layout);
    if (layout === 1) {
      addLog(isAr ? 'ملعب واحد كامل' : 'Single full court', 'info', '🏟️');
      addToast(isAr ? 'وضع الملعب' : 'Court Mode', isAr ? 'ملعب واحد' : 'Single Court', 'info');
    } else if (layout === 2) {
      addLog(isAr ? 'تقسيم القاعة لملعبين' : 'Court split into 2 halves', 'success', '✂️');
      addToast(isAr ? 'تقسيم الملعب' : 'Split Court', isAr ? 'ملعبين' : '2 Courts Active', 'success');
    } else if (layout === 4) {
      addLog(isAr ? 'تقسيم القاعة لـ 4 ملاعب' : 'Court split into 4 quarters', 'success', '✂️');
      addToast(isAr ? 'تقسيم الملعب' : 'Split Court', isAr ? '4 ملاعب' : '4 Courts Active', 'success');
    }
  };

  const handleSplitModeChange = (side, modeName) => {
    const left = side === 'left' ? modeName : court.leftMode;
    const right = side === 'right' ? modeName : court.rightMode;
    setCourtSplitModes(left, right);
    addLog(`${side === 'left' ? (isAr ? 'يسار' : 'Left') : (isAr ? 'يمين' : 'Right')} → ${modeName}`, 'info', '🏟️');
  };

  const handleQuarterModeChange = (quarter, modeName) => {
    setCourtQuarterMode(quarter, modeName);
    addLog(`${(isAr ? 'الملعب' : 'Court')} ${quarter} → ${modeName}`, 'info', '🏟️');
  };

  const activeFull = COURT_MODES.find(m => m.name === court.mode) || COURT_MODES[3];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Split Toggle */}
      <div className="card" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderColor: court.layout > 1 ? 'rgba(0,229,255,0.3)' : 'var(--border-normal)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '1.5rem' }}>{court.layout > 1 ? '✂️' : '🏟️'}</span>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {court.layout === 4
                ? (isAr ? '4 ملاعب (قاعة مقسمة)' : '4 Courts (Split Hall)')
                : court.layout === 2
                  ? (isAr ? 'ملعبين (قاعة مقسمة)' : '2 Courts (Split Hall)')
                  : (isAr ? 'ملعب واحد (قاعة كاملة)' : 'Single Court (Full Hall)')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              {court.layout === 4
                ? (isAr ? 'القاعة مقسمة 4 ملاعب — كل ربع رياضته' : 'Hall divided into 4 quarter courts')
                : court.layout === 2
                  ? (isAr ? 'القاعة مقسمة لملعبين — كل نصف بنوع رياضة' : 'Hall divided into 2 courts — each half can have different sport')
                  : (isAr ? 'القاعة كاملة بملعب واحد' : 'Full hall with single court layout')
              }
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[1, 2, 4].map(num => (
            <button
              key={num}
              onClick={() => handleLayoutChange(num)}
              style={{
                background: court.layout === num ? 'var(--primary-color)' : 'var(--bg-hover)',
                color: court.layout === num ? '#fff' : 'var(--text-primary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 'X',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Split Mode: Two half-court selectors */}
      {court.layout === 2 && (
        <div className="grid-2" style={{ gap: '16px' }}>
          {/* Left Court */}
          <div className="card" style={{ borderColor: 'rgba(0,122,140,0.3)' }}>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: '#007a8c' }}>
                  {isAr ? '◀ الملعب الأيسر' : 'Left Court ◀'}
                </div>
                <div className="card-subtitle">
                  {isAr ? 'النصف الأيسر من القاعة' : 'Left half of the hall'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {COURT_MODES.filter(m => m.id !== 'multi').map(mode => {
                const isActive = court.leftMode === mode.name;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSplitModeChange('left', mode.name)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px',
                      background: isActive ? `${mode.color}12` : 'var(--bg-hover)',
                      border: `1px solid ${isActive ? mode.color + '44' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      color: isActive ? mode.color : 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      width: '100%',
                      textAlign: isAr ? 'right' : 'left',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{mode.icon}</span>
                    <span style={{ flex: 1 }}>{isAr ? t('court.' + mode.id + '.name') : mode.name}</span>
                    {isActive && <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Court */}
          <div className="card" style={{ borderColor: 'rgba(126,34,206,0.3)' }}>
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: '#7e22ce' }}>
                  {isAr ? 'الملعب الأيمن ▶' : '▶ Right Court'}
                </div>
                <div className="card-subtitle">
                  {isAr ? 'النصف الأيمن من القاعة' : 'Right half of the hall'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {COURT_MODES.filter(m => m.id !== 'multi').map(mode => {
                const isActive = court.rightMode === mode.name;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSplitModeChange('right', mode.name)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px',
                      background: isActive ? `${mode.color}12` : 'var(--bg-hover)',
                      border: `1px solid ${isActive ? mode.color + '44' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      color: isActive ? mode.color : 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      width: '100%',
                      textAlign: isAr ? 'right' : 'left',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{mode.icon}</span>
                    <span style={{ flex: 1 }}>{isAr ? t('court.' + mode.id + '.name') : mode.name}</span>
                    {isActive && <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>●</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Split Mode: 4 quarters selectors */}
      {court.layout === 4 && (
        <div className="grid-4" style={{ gap: '16px' }}>
          {[1, 2, 3, 4].map(q => {
            const quarterColors = ['#007a8c', '#7e22ce', '#b91c1c', '#047857'];
            const qColor = quarterColors[q-1];
            return (
              <div key={q} className="card" style={{ borderColor: `${qColor}44` }}>
                <div className="card-header" style={{ padding: '12px' }}>
                  <div className="card-title" style={{ color: qColor, fontSize: '0.9rem' }}>
                    {isAr ? `الملعب ${q}` : `Court ${q}`}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 12px 12px' }}>
                  {COURT_MODES.filter(m => m.id !== 'multi').map(mode => {
                    const isActive = court[`q${q}Mode`] === mode.name;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleQuarterModeChange(q, mode.name)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px',
                          background: isActive ? `${mode.color}12` : 'var(--bg-hover)',
                          border: `1px solid ${isActive ? mode.color + '44' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          color: isActive ? mode.color : 'var(--text-primary)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          width: '100%',
                          textAlign: isAr ? 'right' : 'left',
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{mode.icon}</span>
                        <span style={{ flex: 1 }}>{isAr ? t('court.' + mode.id + '.name') : mode.name}</span>
                        {isActive && <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>●</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full court mode buttons (when not split) */}
      {court.layout === 1 && (
        <>
          {/* Active banner */}
          <div className="card" style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
            background: `linear-gradient(135deg, var(--bg-card), ${activeFull.color}0d)`,
            border: `1px solid ${activeFull.color}44`,
            boxShadow: `0 0 20px ${activeFull.color}15`,
          }}>
            <span style={{ fontSize: '2rem' }}>{activeFull.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem',
                color: activeFull.color, textTransform: 'uppercase',
              }}>
                {isAr ? t('court.' + activeFull.id + '.name') : activeFull.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                {isAr ? t('court.' + activeFull.id + '.desc') : activeFull.desc}
              </div>
            </div>
            <span className="badge" style={{
              background: `${activeFull.color}18`, color: activeFull.color,
              border: `1px solid ${activeFull.color}44`,
            }}>
              ● {t('badge.active')}
            </span>
          </div>

          {/* Mode buttons */}
          <div className="grid-4">
            {COURT_MODES.map(mode => {
              const isActive = court.mode === mode.name;
              return (
                <button
                  key={mode.id}
                  className={`court-mode-btn ${isActive ? 'active' : ''}`}
                  style={{ '--cm-color': mode.color, '--cm-glow': mode.glow }}
                  onClick={() => handleSetMode(mode)}
                >
                  <div className="cm-icon">{mode.icon}</div>
                  <div className="cm-name" style={{ color: isActive ? mode.color : 'var(--text-primary)' }}>
                    {isAr ? t('court.' + mode.id + '.name') : mode.name}
                  </div>
                  <div className="cm-desc">
                    {isAr ? t('court.' + mode.id + '.desc') : mode.desc}
                  </div>
                  {isActive && (
                    <div style={{ marginTop: '12px' }}>
                      <span className="badge" style={{
                        background: `${mode.color}18`, color: mode.color,
                        border: `1px solid ${mode.color}44`,
                      }}>
                        ● {t('badge.active')}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
