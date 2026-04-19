import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';
import { CONTENT_PREVIEWS } from '../../data/contentLibrary';

export default function ScreenPreviewOverlay() {
  const { t } = useI18n();
  const preview = useStore(s => s.screenPreview);
  const closePreview = useStore(s => s.closeScreenPreview);
  const screens = useStore(s => s.screens);

  useEffect(() => {
    if (!preview.active) return;
    const timer = setTimeout(() => {
      closePreview();
    }, preview.duration || 3000);
    return () => clearTimeout(timer);
  }, [preview, closePreview]);

  if (!preview.active) return null;

  let screenName = preview.screenId === 'All' ? t('screens.all', 'All Screens') : '';
  if (preview.screenId !== 'All' && preview.screenId != null) {
    const s = screens.find(x => x.id === preview.screenId);
    if (s) screenName = s.name;
  }

  const previewData = CONTENT_PREVIEWS[preview.content] || CONTENT_PREVIEWS['default'];

  return (
    <AnimatePresence>
      {preview.active && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ duration: 0.4, type: 'spring', damping: 20 }}
          style={{
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Main Display Container */}
          <div style={{
            width: '600px',
            height: '340px',
            background: '#ffffff',
            border: '4px solid #f0f2f5',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(141, 27, 61, 0.05)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* The "Screen" itself */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Animated Background */}
              <div style={{
                position: 'absolute', inset: 0,
                background: previewData.bg,
                opacity: 0.8
              }} />
              
              {/* Scanlines Effect */}
              <div 
                className="screen-scanlines"
                style={{ position: 'absolute', inset: 0, opacity: 0.5 }} 
              />
              
              {/* Glare/Glass effect */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                pointerEvents: 'none'
              }} />

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  fontSize: '6rem',
                  lineHeight: 1,
                  filter: `drop-shadow(0 0 20px ${previewData.color}80)`
                }}>
                  {preview.contentIcon || '📺'}
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: previewData.color,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textShadow: `0 2px 8px rgba(141,27,61,0.1)`
                }}>
                  {t(preview.content)}
                </div>
              </div>
            </div>

            {/* Bottom Bezel Info */}
            <div style={{
              height: '40px',
              background: '#f8f9fa',
              borderTop: '1px solid #f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px'
            }}>
              <span style={{ color: '#8D1B3D', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {t(screenName).toUpperCase()}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                {t('PREVIEW MODE')}
              </span>
              
              {/* Duration Progress bar inside bezel */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (preview.duration || 3000) / 1000, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0,
                  height: '2px',
                  background: '#8D1B3D',
                  boxShadow: '0 0 10px #8D1B3D'
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
