import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClass = type === 'success' 
    ? 'bg-elevated border-success/30 text-success' 
    : 'bg-elevated border-danger/30 text-danger';

  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-success' : 'text-danger';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-premium border shadow-lg ${bgClass} glass-panel-dark max-w-sm`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <span className="text-sm font-medium pr-4 text-textPrimary">{message}</span>
      <button 
        onClick={onClose}
        className="ml-auto text-textMuted hover:text-textSecondary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
