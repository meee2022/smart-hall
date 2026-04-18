import { useState } from 'react';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { CONTENT_PREVIEWS, ContentLibrary } from '../../data/contentLibrary';

/* ── ScreenCard sub-component ─────────────────────────────────── */
function ScreenCard({ screen, isSelected }) {
  const { t } = useI18n();

  const setScreenStatus  = useStore(s => s.setScreenStatus);
  const setScreenContent = useStore(s => s.setScreenContent);
  const setSelectedScreenId = useStore(s => s.setSelectedScreenId);
  const addLog   = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);
  const openModal = useStore(s => s.openModal);
  const closeModal = useStore(s => s.closeModal);

  const preview = CONTENT_PREVIEWS[screen.content] || CONTENT_PREVIEWS['default'];
  const isOff   = screen.status === 'off';

  const badgeClass = `badge badge-${screen.status === 'emergency' ? 'off' : screen.status}`;

  /* drag-and-drop: receive content dropped from ContentLibrary */
  const handleDragOver  = e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
  const handleDragLeave = e => { e.currentTarget.classList.remove('drag-over'); };
  const handleDrop      = e => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const contentId = e.dataTransfer.getData('contentId');
    if (!contentId) return;
    const item = ContentLibrary.getItemById(contentId);
    if (!item) return;
    setScreenContent(screen.id, contentId);
    addLog(`${screen.name}: content set to "${item.name}"`, 'success', '🖥️');
    addToast('Content Assigned', `${item.name} → ${screen.name}`, 'success');
  };

  /* toggle play/pause */
  const handlePlayPause = () => {
    if (isOff) {
      setScreenStatus(screen.id, 'on');
      addLog(`${screen.name} powered on`, 'info', '⚡');
      addToast('Screen On', screen.name, 'info');
    } else if (screen.status === 'playing') {
      setScreenStatus(screen.id, 'paused');
      addLog(`${screen.name} paused`, 'warning', '⏸️');
      addToast('Paused', screen.name, 'warning');
    } else {
      setScreenStatus(screen.id, 'playing');
      addLog(`${screen.name} resumed`, 'success', '▶️');
      addToast('Playing', screen.name, 'success');
    }
  };

  const handleStop = () => {
    setScreenStatus(screen.id, 'off');
    addLog(`${screen.name} stopped`, 'warning', '⏹️');
    addToast('Screen Off', screen.name, 'warning');
  };

  /* Content picker modal */
  const handleContentModal = () => {
    openModal(
      <div>
        <div className="modal-header">
          <div>
            <div className="modal-title">📂 Content Library</div>
            <div className="modal-subtitle">Assign content to {screen.name}</div>
          </div>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
          {ContentLibrary.categories.map(cat => (
            <div key={cat.id}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 0', marginBottom: '8px',
                borderBottom: `1px solid ${cat.color}33`,
              }}>
                <span>{cat.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, color: cat.color }}>
                  {cat.name}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {cat.items.map(item => (
                  <button
                    key={item.id}
                    className="content-item-card"
                    style={{ width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      setScreenContent(screen.id, item.id);
                      addLog(`${screen.name}: content set to "${item.name}"`, 'success', '🖥️');
                      addToast('Content Assigned', `${item.name} → ${screen.name}`, 'success');
                      closeModal();
                    }}
                  >
                    <span className="content-item-icon">{item.icon}</span>
                    <div>
                      <div className="content-item-name">{t(item.name)}</div>
                      <div className="content-item-meta">{t(item.duration)} · {t(cat.name)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('modal.cancel', 'Cancel')}</button>
        </div>
      </div>
    );
  };

  /* Group info modal */
  const handleGroup = () => {
    addLog(`${screen.name} group action triggered`, 'info', '🔗');
    addToast('Group', `${screen.name} group action`, 'info');
  };

  return (
    <div
      className={`screen-card screen-${screen.status} ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedScreenId(isSelected ? null : screen.id)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ cursor: 'pointer' }}
    >
      {/* Preview area */}
      <div className="screen-card-top">
        <div
          className="screen-preview-bg"
          style={{ background: preview.bg }}
        />
        <div className="screen-scanlines" />
        <div className="screen-preview-content">
          <div className="screen-preview-icon">
            {isOff ? '⏹️' : (screen.contentIcon || '📺')}
          </div>
          <div className="screen-preview-label" style={{ color: preview.color }}>
            {isOff
              ? t('screen.offline', 'OFFLINE')
              : screen.status === 'emergency'
                ? t('screen.emergency', 'EMERGENCY')
                : (screen.content ? t(screen.content) : t('No content'))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="screen-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="screen-name">{t(screen.name)}</span>
          <span className={badgeClass}>
            <span className="badge-dot" />
            {screen.status === 'emergency' ? 'EMRG' : screen.status.toUpperCase()}
          </span>
        </div>
        <div className="screen-content-info">
          {screen.content
            ? <><span className="content-dot" style={{ background: preview.color }} />{t(screen.content)}</>
            : <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{t('screen.no.content', 'No content assigned')}</span>
          }
        </div>

        {/* Action buttons */}
        <div className="screen-actions" onClick={e => e.stopPropagation()}>
          <button
            className={`btn btn-sm ${screen.status === 'playing' ? 'btn-warning' : 'btn-success'}`}
            onClick={handlePlayPause}
          >
            {screen.status === 'playing'
              ? <>{t('screen.btn.pause', 'Pause')}</>
              : isOff
                ? <>{t('screen.btn.play', 'Play')}</>
                : <>{t('screen.btn.resume', 'Resume')}</>
            }
          </button>
          {!isOff && (
            <button className="btn btn-sm btn-danger" onClick={handleStop}>
              {t('screen.btn.stop', 'Stop')}
            </button>
          )}
          <button className="btn btn-sm btn-primary" onClick={handleContentModal}>
            {t('screen.btn.content', 'Content')}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleGroup}>
            {t('screen.btn.group', 'Group')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Split Mode Modal content ──────────────────────────────────── */
function SplitModeModal({ screens, closeModal }) {
  const [assignments, setAssignments] = useState(
    screens.reduce((acc, s) => { acc[s.id] = ''; return acc; }, {})
  );
  const setScreenContent = useStore(s => s.setScreenContent);
  const addLog   = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);

  const allCategories = ContentLibrary.categories;
  const allItems = allCategories.flatMap(c => c.items.map(i => ({ ...i, catName: c.name })));

  const handleApply = () => {
    let applied = 0;
    Object.entries(assignments).forEach(([screenId, contentId]) => {
      if (contentId) {
        setScreenContent(Number(screenId), contentId);
        applied++;
      }
    });
    if (applied > 0) {
      addLog(`Split mode applied — ${applied} screen(s) updated`, 'success', '🔀');
      addToast('Split Mode Applied', `${applied} screen(s) updated`, 'success');
    }
    closeModal();
  };

  return (
    <div>
      <div className="modal-header">
        <div>
          <div className="modal-title">🔀 Split Mode</div>
          <div className="modal-subtitle">Assign different content to each screen</div>
        </div>
        <button className="modal-close" onClick={closeModal}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
        {screens.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.8rem', color: 'var(--text-primary)',
              minWidth: '100px',
            }}>
              {t(s.name)}
            </span>
            <select
              value={assignments[s.id]}
              onChange={e => setAssignments(prev => ({ ...prev, [s.id]: e.target.value }))}
              style={{
                flex: 1, background: 'var(--bg-hover)', border: '1px solid var(--border-normal)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer',
              }}
            >
              <option value="">— Keep current —</option>
              {allItems.map(item => (
                <option key={item.id} value={item.id}>{item.icon} {t(item.name)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={handleApply}>Apply Split</button>
      </div>
    </div>
  );
}

/* ── Assign-to-All Modal content ───────────────────────────────── */
function AssignAllModal({ closeModal }) {
  const setAllScreensContent = useStore(s => s.setAllScreensContent);
  const addLog   = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);

  const handleAssign = (item) => {
    setAllScreensContent(item.id);
    addLog(`All screens: content set to "${item.name}"`, 'success', '📺');
    addToast('Assigned to All', item.name, 'success');
    closeModal();
  };

  return (
    <div>
      <div className="modal-header">
        <div>
          <div className="modal-title">📺 Assign to All Screens</div>
          <div className="modal-subtitle">Choose content to display on all 4 screens</div>
        </div>
        <button className="modal-close" onClick={closeModal}>✕</button>
      </div>
      <div style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
        {ContentLibrary.categories.map(cat => (
          <div key={cat.id}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '4px 0', marginBottom: '6px',
              borderBottom: `1px solid ${cat.color}33`,
            }}>
              <span>{cat.icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: cat.color, fontWeight: 600 }}>
                {t(cat.name)}
              </span>
            </div>
            {cat.items.map(item => (
              <button
                key={item.id}
                className="content-item-card"
                style={{ width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer', marginBottom: '4px' }}
                onClick={() => handleAssign(item)}
              >
                <span className="content-item-icon">{item.icon}</span>
                <div>
                  <div className="content-item-name">{t(item.name)}</div>
                  <div className="content-item-meta">{t(item.duration)}</div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

/* ── Emergency Confirm Modal ───────────────────────────────────── */
function EmergencyModal({ closeModal }) {
  const emergencyMode = useStore(s => s.emergencyMode);
  const addLog   = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);
  const { t } = useI18n();

  const handleConfirm = () => {
    emergencyMode();
    addLog('EMERGENCY MODE ACTIVATED — all screens on safety guidance', 'danger', '🚨');
    addToast('Emergency Mode', 'All screens switched to emergency', 'danger');
    closeModal();
  };

  return (
    <div>
      <div className="modal-header">
        <div>
          <div className="modal-title" style={{ color: '#ff3b5c' }}>🚨 {t('emergency.title', 'Emergency Mode')}</div>
        </div>
        <button className="modal-close" onClick={closeModal}>✕</button>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '12px 0' }}>
        {t('emergency.msg', 'This will switch ALL screens to emergency guidance and activate safety lighting. Confirm?')}
      </p>
      <div className="modal-footer">
        <button className="btn btn-ghost btn-sm" onClick={closeModal}>{t('modal.cancel', 'Cancel')}</button>
        <button className="btn btn-danger btn-sm" onClick={handleConfirm}>
          🚨 {t('emergency.confirm', 'ACTIVATE EMERGENCY')}
        </button>
      </div>
    </div>
  );
}

/* ── Main ScreenPanel ──────────────────────────────────────────── */
export default function ScreenPanel() {
  const { t } = useI18n();

  const screens         = useStore(s => s.screens);
  const selectedScreenId = useStore(s => s.selectedScreenId);
  const powerAll        = useStore(s => s.powerAll);
  const stopAll         = useStore(s => s.stopAll);
  const syncScreens     = useStore(s => s.syncScreens);
  const addLog          = useStore(s => s.addLog);
  const addToast        = useStore(s => s.addToast);
  const openModal       = useStore(s => s.openModal);
  const closeModal      = useStore(s => s.closeModal);

  const handlePowerAll = () => {
    powerAll();
    addLog('All screens powered on', 'success', '⚡');
    addToast('Power All', 'All 4 screens are now on', 'success');
  };

  const handleStopAll = () => {
    stopAll();
    addLog('All screens stopped', 'warning', '⏹️');
    addToast('Stop All', 'All screens turned off', 'warning');
  };

  const handleSyncAll = () => {
    syncScreens();
    addLog('Screens synchronized to matching content', 'info', '🔗');
    addToast('Sync All', 'Screens synchronized', 'info');
  };

  const handleSplitMode = () => {
    openModal(<SplitModeModal screens={screens} closeModal={closeModal} />);
  };

  const handleAssignAll = () => {
    openModal(<AssignAllModal closeModal={closeModal} />);
  };

  const handleEmergency = () => {
    openModal(<EmergencyModal closeModal={closeModal} />);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <h1 className="section-title">{t('screens.title', 'Screens Control')}</h1>
        <p className="section-subtitle">{t('screens.sub', 'Manage individual and grouped display content')}</p>
      </div>

      {/* ── Global Controls Bar ── */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="qa-label">{t('screens.global', 'Global Controls')}</span>
          <div style={{ height: '16px', width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }} />

          <button className="btn btn-success btn-sm" onClick={handlePowerAll}>
            ⚡ {t('btn.power.all', 'Power All')}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleStopAll}>
            ⏹️ {t('btn.stop.all', 'Stop All')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSyncAll}>
            🔗 {t('btn.sync.all', 'Sync All')}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleSplitMode}>
            🔀 {t('btn.split', 'Split Mode')}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleAssignAll}>
            📺 {t('btn.assign.all', 'Assign to All')}
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-danger btn-sm" onClick={handleEmergency}
            style={{ background: 'rgba(255,59,92,0.2)', borderColor: 'rgba(255,59,92,0.5)' }}>
            🚨 {t('btn.emergency', 'Emergency Mode')}
          </button>
        </div>
      </div>

      {/* ── Screen Cards Grid ── */}
      <div className="grid-4">
        {screens.map(screen => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            isSelected={selectedScreenId === screen.id}
          />
        ))}
      </div>

    </div>
  );
}
