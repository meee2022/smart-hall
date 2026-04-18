import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { LIGHTING_MODES } from '../../data/lightingModes';

export default function LightingPanel() {
  const { t } = useI18n();

  const lighting          = useStore(s => s.lighting);
  const setLightingMode   = useStore(s => s.setLightingMode);
  const setLightingIntensity = useStore(s => s.setLightingIntensity);
  const setLightingColor  = useStore(s => s.setLightingColor);
  const toggleLedLines    = useStore(s => s.toggleLedLines);
  const addLog            = useStore(s => s.addLog);
  const addToast          = useStore(s => s.addToast);

  const handleSetMode = (mode) => {
    setLightingMode(mode.name, mode.color, mode.intensity);
    addLog(`Lighting mode changed to "${mode.name}"`, 'info', '💡');
    addToast('Lighting Mode', mode.name, 'info');
  };

  const handleIntensityChange = (e) => {
    const value = Number(e.target.value);
    setLightingIntensity(value);
  };

  const handleIntensityCommit = (e) => {
    const value = Number(e.target.value);
    addLog(`Lighting intensity set to ${value}%`, 'info', '🔆');
  };

  const handleColorChange = (e) => {
    setLightingColor(e.target.value);
  };

  const handleColorCommit = (e) => {
    addLog(`Ambient color changed to ${e.target.value}`, 'info', '🎨');
    addToast('Color Changed', e.target.value, 'info');
  };

  const handleToggleLed = () => {
    toggleLedLines();
    const next = !lighting.ledLines;
    addLog(`LED Court Lines ${next ? 'enabled' : 'disabled'}`, 'info', '💡');
    addToast('LED Lines', next ? 'Enabled' : 'Disabled', 'info');
  };

  const handleToggleAmbient = () => {
    // ambient toggle — store has lighting.ambient flag
    // We replicate the pattern of setLightingMode to flip ambient
    const nextAmbient = !lighting.ambient;
    useStore.setState(state => ({
      lighting: { ...state.lighting, ambient: nextAmbient }
    }));
    addLog(`Ambient lighting ${nextAmbient ? 'enabled' : 'disabled'}`, 'info', '🌟');
    addToast('Ambient Lighting', nextAmbient ? 'Enabled' : 'Disabled', 'info');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <h1 className="section-title">{t('lighting.title', 'Lighting Control')}</h1>
        <p className="section-subtitle">{t('lighting.sub', 'Manage ambient lighting, LED lines, and intensity')}</p>
      </div>

      {/* ── Active Lighting Status Bar ── */}
      <div
        className="card"
        style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '14px 20px',
          background: `linear-gradient(135deg, var(--bg-card), ${lighting.color}0d)`,
          border: `1px solid ${lighting.color}44`,
          boxShadow: `0 0 20px ${lighting.color}15`,
        }}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: `radial-gradient(circle, ${lighting.color}aa, ${lighting.color}22)`,
          boxShadow: `0 0 16px ${lighting.color}`,
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1rem', color: lighting.color, textTransform: 'uppercase',
          }}>
            {t(lighting.mode)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Intensity: {lighting.intensity}% · LED Lines: {lighting.ledLines ? t('On') : t('Off')} · Ambient: {lighting.ambient ? t('On') : t('Off')}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', color: lighting.color }}>
          {lighting.intensity}%
        </div>
      </div>

      {/* ── Preset Modes ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('lighting.presets', 'Preset Modes')}</div>
        </div>
        <div className="grid-3">
          {LIGHTING_MODES.map(mode => {
            const isActive = lighting.mode === mode.name;
            return (
              <button
                key={mode.id}
                className={`lighting-mode-btn ${isActive ? 'active' : ''}`}
                style={{
                  '--lm-color': mode.color,
                  '--lm-glow': mode.glow,
                }}
                onClick={() => handleSetMode(mode)}
              >
                <div className="lm-icon">{mode.icon}</div>
                <div className="lm-name" style={{ color: isActive ? mode.color : 'var(--text-primary)' }}>
                  {t(mode.name)}
                </div>
                <div style={{
                  fontSize: '0.62rem', color: 'var(--text-muted)',
                  marginTop: '4px', lineHeight: 1.3,
                }}>
                  {t('lm.' + mode.id + '.desc', mode.description)}
                </div>
                {isActive && (
                  <div style={{ marginTop: '8px' }}>
                    <span className="badge" style={{
                      background: `${mode.color}18`,
                      color: mode.color,
                      border: `1px solid ${mode.color}44`,
                    }}>
                      {t('badge.active', 'ACTIVE')}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Advanced Settings ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">{t('lighting.advanced', 'Advanced Settings')}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Intensity slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {t('lighting.intensity', 'Brightness Intensity')}
              </label>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '1.1rem', color: 'var(--accent-cyan)',
              }}>
                {lighting.intensity}%
              </span>
            </div>
            <input
              type="range"
              className="slider-input"
              min={0}
              max={100}
              value={lighting.intensity}
              onChange={handleIntensityChange}
              onMouseUp={handleIntensityCommit}
              onTouchEnd={handleIntensityCommit}
              style={{
                background: `linear-gradient(to right, var(--accent-cyan) ${lighting.intensity}%, var(--bg-hover) ${lighting.intensity}%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>0%</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>50%</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>100%</span>
            </div>
          </div>

          <div className="glow-divider" />

          {/* Color picker */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {t('lighting.color', 'Ambient Light Color')}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {lighting.color.toUpperCase()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: lighting.color,
                boxShadow: `0 0 12px ${lighting.color}`,
                border: '2px solid rgba(255,255,255,0.15)',
              }} />
              <input
                type="color"
                value={lighting.color}
                onChange={handleColorChange}
                onBlur={handleColorCommit}
                style={{
                  width: '44px', height: '44px',
                  border: '1px solid var(--border-normal)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-hover)',
                  cursor: 'pointer', padding: '2px',
                }}
              />
            </div>
          </div>

          <div className="glow-divider" />

          {/* LED Lines toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {t('toggle.led', 'LED Court Lines')}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Smart LED floor perimeter illumination
              </div>
            </div>
            <label className="toggle" onClick={handleToggleLed} style={{ cursor: 'pointer' }}>
              <input type="checkbox" readOnly checked={lighting.ledLines} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="glow-divider" />

          {/* Ambient Lighting toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {t('toggle.ambient', 'Ambient Lighting')}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Secondary ambient fill lights around the arena
              </div>
            </div>
            <label className="toggle" onClick={handleToggleAmbient} style={{ cursor: 'pointer' }}>
              <input type="checkbox" readOnly checked={lighting.ambient} />
              <span className="toggle-slider" />
            </label>
          </div>

        </div>
      </div>

    </div>
  );
}
