import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

export default function Modal() {
  const { open, content } = useStore(state => state.modal);
  const closeModal = useStore(state => state.closeModal);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
