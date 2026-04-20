import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { ContentLibrary } from '../../data/contentLibrary';

/* ── Quick Assign Modal ────────────────────────────────────────── */
function QuickAssignModal({ item, closeModal }) {
  const { t } = useI18n();
  const screens = useStore(s => s.screens);
  const setScreenContent = useStore(s => s.setScreenContent);
  const addLog   = useStore(s => s.addLog);
  const addToast = useStore(s => s.addToast);

  const handleAssign = (screen) => {
    setScreenContent(screen.id, item.id);
    addLog(`${screen.name}: content set to "${item.name}"`, 'success', '🖥️');
    addToast('Content Assigned', `${item.name} → ${screen.name}`, 'success');
    closeModal();
  };

  return (
    <div>
      <div className="modal-header">
        <div>
          <div className="modal-title">{item.icon} {item.name}</div>
          <div className="modal-subtitle">Choose a screen to assign this content</div>
        </div>
        <button className="modal-close" onClick={closeModal}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
        {screens.map(screen => {
          const statusColor = {
            playing: '#008a4b', on: '#007a8c', paused: '#b87500',
            off: '#cc2942', emergency: '#cc2942',
          }[screen.status] || '#7a9bb5';

          return (
            <button
              key={screen.id}
              onClick={() => handleAssign(screen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '12px 16px', cursor: 'pointer',
                background: 'var(--bg-hover)', border: '1px solid var(--border-normal)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#8D1B3D'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-normal)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: statusColor, display: 'inline-block',
                }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {t(screen.name)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {screen.content ? t(screen.content) : t('No content')}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#8D1B3D' }}>→ Assign</span>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={() => {
            const setAllScreensContent = useStore.getState().setAllScreensContent;
            setAllScreensContent(item.id);
            addLog(`All screens: content set to "${item.name}"`, 'success', '📺');
            addToast('Assigned to All', item.name, 'success');
            closeModal();
          }}
        >
          📺 Assign to All Screens
        </button>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost btn-sm" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

/* ── Category Card ─────────────────────────────────────────────── */
function CategoryCard({ category }) {
  const { t } = useI18n();
  const openModal  = useStore(s => s.openModal);
  const closeModal = useStore(s => s.closeModal);

  const handleItemClick = (item) => {
    openModal(<QuickAssignModal item={item} closeModal={closeModal} />);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('contentId', item.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}
    >
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        paddingBottom: '10px',
        borderBottom: `1px solid ${category.color}33`,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
          background: `${category.color}18`,
          border: `1px solid ${category.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', flexShrink: 0,
        }}>
          {category.icon}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '0.85rem', color: category.color, textTransform: 'uppercase',
          }}>
            {t(category.name)}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            {category.items.length} {category.items.length === 1 ? t('item') : t('items')}
          </div>
        </div>
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {category.items.map(item => (
          <div
            key={item.id}
            className="content-item-card"
            draggable="true"
            onDragStart={e => handleDragStart(e, item)}
            onClick={() => handleItemClick(item)}
            title="Click to assign • Drag to screen"
          >
            <span className="content-item-icon">{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="content-item-name">{t(item.name)}</div>
              <div className="content-item-meta">{t(item.duration)}</div>
            </div>
            <div style={{
              fontSize: '0.6rem', color: category.color,
              fontFamily: 'var(--font-mono)', opacity: 0.7,
              flexShrink: 0,
            }}>
              ↗
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ContentLibrary section ───────────────────────────────── */
export default function ContentLibraryPanel() {
  const { t } = useI18n();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Section Header ── */}
      <div className="section-header">
        <h1 className="section-title">{t('content.title', 'Content Library')}</h1>
        <p className="section-subtitle">{t('content.sub', 'Drag content cards to screens or click to assign')}</p>
      </div>

      {/* ── Hint bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px',
        background: 'rgba(141, 27, 61, 0.05)',
        border: '1px solid rgba(141, 27, 61, 0.15)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem', color: 'var(--text-secondary)',
      }}>
        <span style={{ fontSize: '1rem' }}>💡</span>
        <span>
          <strong style={{ color: 'var(--accent-cyan)' }}>Tip:</strong>{' '}
          Click any content card to open the quick-assign panel, or drag it directly onto a screen in the Screens Control section.
        </span>
      </div>

      {/* ── Category grid ── */}
      <div className="grid-3">
        {ContentLibrary.categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

    </div>
  );
}
