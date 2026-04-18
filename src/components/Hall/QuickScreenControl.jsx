import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { ContentLibrary } from '../../data/contentLibrary';

export default function QuickScreenControl() {
  const { t } = useI18n();
  const selectedScreenId = useStore(s => s.selectedScreenId);
  const screens = useStore(s => s.screens);
  const setScreenStatus = useStore(s => s.setScreenStatus);
  const setScreenContent = useStore(s => s.setScreenContent);
  const setSelectedScreenId = useStore(s => s.setSelectedScreenId);

  const screen = screens.find(s => s.id === selectedScreenId);

  if (!screen) return null;

  const isOff = screen.status === 'off';

  const handlePlayPause = () => {
    if (isOff) {
      setScreenStatus(screen.id, 'on');
    } else if (screen.status === 'playing') {
      setScreenStatus(screen.id, 'paused');
    } else {
      setScreenStatus(screen.id, 'playing');
    }
  };

  const handleStop = () => {
    setScreenStatus(screen.id, 'off');
  };

  const allItems = ContentLibrary.categories.flatMap(c => c.items);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '280px',
          background: 'rgba(10, 15, 25, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-normal)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {t(screen.name)}
          </h3>
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ padding: '2px 6px', height: 'auto', minHeight: 'unset' }}
            onClick={() => setSelectedScreenId(null)}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${screen.status === 'playing' ? 'btn-warning' : 'btn-success'}`}
            style={{ flex: 1 }}
            onClick={handlePlayPause}
          >
            {screen.status === 'playing' ? t('screen.btn.pause', 'Pause') : isOff ? t('screen.btn.play', 'Play') : t('screen.btn.resume', 'Resume')}
          </button>
          {!isOff && (
            <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={handleStop}>
              {t('screen.btn.stop', 'Stop')}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('Assign Content:')}</label>
          <select
            value={screen.content ? ContentLibrary.categories.flatMap(c=>c.items).find(i => i.name === screen.content)?.id : ''}
            onChange={(e) => {
              if (e.target.value) {
                setScreenContent(screen.id, e.target.value);
              }
            }}
            style={{
              background: 'var(--bg-hover)', border: '1px solid var(--border-normal)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
              padding: '6px 8px', fontSize: '0.8rem', cursor: 'pointer', width: '100%'
            }}
          >
            <option value="" disabled>-- {t('Select Content')} --</option>
            {allItems.map(item => (
              <option key={item.id} value={item.id}>{item.icon} {t(item.name)}</option>
            ))}
          </select>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
