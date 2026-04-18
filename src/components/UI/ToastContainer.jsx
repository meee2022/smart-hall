import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

export default function ToastContainer() {
  const toasts = useStore(state => state.toasts);
  const removeToast = useStore(state => state.removeToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => removeToast(latest.id), 3500);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
