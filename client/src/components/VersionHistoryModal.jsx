import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, FileText, AlertTriangle, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export default function VersionHistoryModal({ isOpen, onClose, contract, onViewVersion, onCompare }) {
  if (!isOpen || !contract) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-background border border-border/60 shadow-2xl rounded-xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-textPrimary">Version History</h2>
                <p className="text-xs text-textMuted mt-0.5">{contract.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-textMuted hover:text-textPrimary hover:bg-border/50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-background/30">
            <div className="space-y-4 relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-border z-0" />

              {contract.versions.map((version, index) => {
                const isCurrent = index === 0;
                const riskColor = version.riskLevel === 'High' ? 'text-danger bg-danger/10 border-danger/20' :
                                  version.riskLevel === 'Medium' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20';
                const previousVersion = contract.versions[index + 1];

                return (
                  <div key={version.id} className="relative z-10 flex gap-4">
                    {/* Node */}
                    <div className="flex-shrink-0 w-12 flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-[3px] border-elevated mt-1 shadow-sm ${isCurrent ? 'bg-accent' : 'bg-border'}`} />
                    </div>

                    {/* Card */}
                    <div className={`flex-1 p-5 rounded-xl border transition-all ${isCurrent ? 'bg-card border-accent/40 shadow-sm ring-1 ring-accent/10' : 'bg-card border-border/50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-textPrimary">
                              Version {version.versionNumber}
                            </h3>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-accent text-secondaryBg text-[10px] font-bold uppercase rounded-full tracking-wide">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-textMuted mt-1">
                            Uploaded on {new Date(version.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${riskColor}`}>
                          {version.riskLevel === 'High' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          Risk: {version.riskScore}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                        <button
                          onClick={() => { onClose(); onViewVersion(contract.id, version.id); }}
                          className="px-4 py-2 bg-background border border-border hover:bg-border text-textSecondary font-semibold rounded-lg text-sm transition-all"
                        >
                          View Report
                        </button>
                        
                        {previousVersion && (
                          <button
                            onClick={() => { onClose(); onCompare(version.id, previousVersion.id); }}
                            className="px-4 py-2 bg-card border border-border hover:bg-border text-textSecondary font-semibold rounded-lg text-sm transition-all flex items-center gap-2"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                            Compare with V{previousVersion.versionNumber}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
