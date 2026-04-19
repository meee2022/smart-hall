import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { useI18n } from '../../hooks/useI18n';

const BROADCAST_TYPES = {
  content: { label: 'broadcast.type.content', bgPattern: 'radial' },
  announcement: { label: 'broadcast.type.announcement', bgPattern: 'spotlight' },
  student: { label: 'broadcast.type.student', bgPattern: 'celebration' },
  emergency: { label: 'broadcast.type.emergency', bgPattern: 'alert' },
  event: { label: 'broadcast.type.event', bgPattern: 'radial' },
  score: { label: 'broadcast.type.score', bgPattern: 'spotlight' },
  custom: { label: 'broadcast.type.custom', bgPattern: 'radial' },
};

function ParticleEffect({ color }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: '100vh', x: `${p.x}vw` }}
          animate={{ opacity: [0, 0.6, 0], y: '-10vh' }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            filter: `blur(${p.size > 4 ? 2 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

function CelebrationEffect() {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#00e5ff', '#00ff88', '#ffdd00', '#ff6b35', '#a855f7', '#ff3b5c'][i % 6],
    size: 4 + Math.random() * 6,
    delay: Math.random() * 1.5,
    rotation: Math.random() * 720,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {confetti.map(c => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: '-10vh', x: `${c.x}vw`, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: '110vh', rotate: c.rotation }}
          transition={{ duration: 3.5, delay: c.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: c.size,
            height: c.size * 1.5,
            background: c.color,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
  );
}

export default function BroadcastOverlay() {
  const { t } = useI18n();
  const broadcast = useStore(s => s.broadcast);
  const closeBroadcast = useStore(s => s.closeBroadcast);

  const handleClose = useCallback(() => {
    closeBroadcast();
  }, [closeBroadcast]);

  useEffect(() => {
    if (!broadcast.active) return;
    const timer = setTimeout(handleClose, broadcast.duration || 5000);
    return () => clearTimeout(timer);
  }, [broadcast.active, broadcast.duration, handleClose]);

  useEffect(() => {
    if (!broadcast.active) return;
    const handler = (e) => {
      if (e.key === 'Escape' || e.key === ' ') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [broadcast.active, handleClose]);

  const typeConfig = BROADCAST_TYPES[broadcast.type] || BROADCAST_TYPES.custom;
  const isEmergency = broadcast.type === 'emergency';
  const isCelebration = broadcast.type === 'student';
  const color = broadcast.color || '#00e5ff';

  return (
    <AnimatePresence>
      {broadcast.active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: isEmergency
              ? 'linear-gradient(180deg, #1a0000 0%, #0a0000 50%, #1a0000 100%)'
              : `linear-gradient(180deg, #020408 0%, #080d14 40%, #0a1020 100%)`,
            overflow: 'hidden',
          }}
        >
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: isEmergency
              ? 'radial-gradient(ellipse at center, rgba(255,59,92,0.15) 0%, transparent 70%)'
              : `radial-gradient(ellipse at center, ${color}15 0%, transparent 60%)`,
            pointerEvents: 'none',
          }} />

          {/* Edge glow lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          {/* Particles or Celebration */}
          {isCelebration ? <CelebrationEffect /> : <ParticleEffect color={color} />}

          {/* Emergency pulse rings */}
          {isEmergency && (
            <>
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  width: '200px', height: '200px',
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                }}
              />
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                style={{
                  position: 'absolute',
                  width: '200px', height: '200px',
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                }}
              />
            </>
          )}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', damping: 20, stiffness: 200 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              zIndex: 1,
              maxWidth: '700px',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            {/* Type label */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.7rem',
                color: color,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: '6px 20px',
                border: `1px solid ${color}40`,
                borderRadius: '20px',
                background: `${color}10`,
              }}
            >
              {t(typeConfig.label)}
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 12 }}
              style={{
                fontSize: broadcast.image ? '1rem' : '5rem',
                lineHeight: 1,
                filter: `drop-shadow(0 0 30px ${color}60)`,
              }}
            >
              {broadcast.image ? (
                <div style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  border: `3px solid ${color}`,
                  boxShadow: `0 0 40px ${color}40, inset 0 0 40px ${color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  background: `${color}08`,
                }}>
                  {broadcast.icon}
                </div>
              ) : (
                broadcast.icon
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                fontFamily: "var(--font-display, 'Rajdhani', sans-serif)",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                textShadow: `0 0 40px ${color}50`,
                margin: 0,
              }}
            >
              {broadcast.title}
            </motion.h1>

            {/* Subtitle */}
            {broadcast.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                  maxWidth: '500px',
                  margin: 0,
                }}
              >
                {broadcast.subtitle}
              </motion.p>
            )}

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                width: '120px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                marginTop: '8px',
              }}
            />

            {/* Screen indicator */}
            {broadcast.screens && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                {['N', 'S', 'E', 'W'].map((label, i) => {
                  const isActive = broadcast.screens === 'all' || (Array.isArray(broadcast.screens) && broadcast.screens.includes(i + 1));
                  return (
                    <div key={label} style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
                      background: isActive ? `${color}15` : 'rgba(255,255,255,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isActive ? color : 'rgba(255,255,255,0.2)',
                      boxShadow: isActive ? `0 0 15px ${color}30` : 'none',
                    }}>
                      {label}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (broadcast.duration || 5000) / 1000, ease: 'linear' }}
                style={{ height: '100%', background: color }}
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {t('broadcast.dismiss')}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
