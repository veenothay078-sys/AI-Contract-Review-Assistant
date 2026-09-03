import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck, HelpCircle, Activity, Sparkles, Clipboard } from 'lucide-react';

export default function ClauseDetailsModal({ clause, isOpen, onClose }) {
  if (!isOpen || !clause) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return { text: 'text-success', border: 'border-success/20', bg: 'bg-success/10' };
      case 'Medium':
        return { text: 'text-warning', border: 'border-warning/20', bg: 'bg-warning/10' };
      case 'High':
        return { text: 'text-danger', border: 'border-danger/20', bg: 'bg-danger/10' };
      default:
        return { text: 'text-textSecondary', border: 'border-border', bg: 'bg-card' };
    }
  };

  const riskStyles = getRiskColor(clause.riskLevel);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl bg-background border border-border/60 rounded-xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/50 bg-card/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${riskStyles.bg} ${riskStyles.text} border ${riskStyles.border}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-textPrimary">{clause.title}</h3>
                <p className="text-xs text-textMuted mt-0.5">{clause.section || 'General Section'} • {clause.category || 'GENERAL'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 bg-card hover:bg-border rounded-lg text-textMuted hover:text-textSecondary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Top Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-center">
                <span className="text-xs text-textMuted uppercase font-semibold tracking-wider">Risk Level</span>
                <span className={`text-base font-bold mt-1 inline-flex items-center gap-1.5 ${riskStyles.text}`}>
                  <span className={`w-2 h-2 rounded-full ${clause.riskLevel === 'Low' ? 'bg-success' : clause.riskLevel === 'Medium' ? 'bg-warning' : 'bg-danger'}`} />
                  {clause.riskLevel} Risk
                </span>
              </div>
              <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-center">
                <span className="text-xs text-textMuted uppercase font-semibold tracking-wider">Risk Score</span>
                <span className="text-xl font-extrabold text-textPrimary mt-1 flex items-baseline gap-1">
                  {clause.riskScore || 50}
                  <span className="text-xs text-textMuted font-medium">/ 100</span>
                </span>
              </div>
              <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-center">
                <span className="text-xs text-textMuted uppercase font-semibold tracking-wider">Classification</span>
                <span className="text-sm font-bold text-accent mt-1 tracking-wide">
                  {clause.category || 'N/A'}
                </span>
              </div>
            </div>

            {/* Original Text */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-textSecondary text-xs font-semibold uppercase tracking-wider">
                <Clipboard className="w-3.5 h-3.5 text-textMuted" />
                <span>Original Clause Text</span>
              </div>
              <p className="text-sm text-textSecondary italic leading-relaxed font-medium bg-background/50 p-3 rounded-lg border border-border/50">
                "{clause.description}"
              </p>
            </div>

            {/* Why Risky & Potential Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
                  <HelpCircle className="w-4 h-4" />
                  <span>Why is this risky?</span>
                </div>
                <p className="text-sm text-textSecondary leading-relaxed">
                  {clause.whyRisky || 'This clause deviates from standard legal safeguards, potentially creating unilateral obligations or exposing the signee to unexpected operations costs.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-danger">
                  <Activity className="w-4 h-4" />
                  <span>Potential Impact</span>
                </div>
                <p className="text-sm text-textSecondary leading-relaxed">
                  {clause.potentialImpact || 'Uncapped financial liabilities, unexpected resource requirements, or legal venue inconvenience.'}
                </p>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Recommended Action</span>
              </div>
              <p className="text-sm text-textSecondary leading-relaxed">
                {clause.recommendedAction || 'Negotiate to redefine this clause to guarantee bilateral liability limits and secure a standard 60-day notice period.'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50 bg-card/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-card hover:bg-elevated border border-border text-textPrimary font-semibold rounded-lg text-sm transition-all active:scale-95 shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
