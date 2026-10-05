import React from 'react';
import { FileText, UploadCloud, History, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyContracts({ contracts, onOpenContract, onUploadNewVersion, onViewHistory, onOpenComparison }) {
  if (!contracts || contracts.length === 0) {
    return null; // Will be handled by empty state in App.jsx
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-textPrimary">My Contracts</h2>
        <button
          onClick={() => onOpenComparison()}
          className="px-4 py-2 bg-card hover:bg-border border border-border text-textSecondary font-semibold rounded-xl text-sm transition-all"
        >
          Compare Contracts
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map(contract => {
          const currentVersion = contract.versions[0]; // Assuming versions are sorted latest first in db.js
          const riskColor = currentVersion?.riskLevel === 'High' ? 'text-danger bg-danger/10 border-danger/20' :
                            currentVersion?.riskLevel === 'Medium' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20';
          
          return (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-border/80"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background border border-border rounded-lg text-accent">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-textPrimary text-base leading-tight line-clamp-1" title={contract.title}>
                        {contract.title}
                      </h3>
                      <p className="text-xs text-textMuted mt-1 font-medium">
                        {contract.contractType}
                      </p>
                    </div>
                  </div>
                </div>
                
                {currentVersion && (
                  <div className="bg-background border border-border rounded-lg p-3.5 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Current Version</span>
                      <span className="px-2 py-0.5 bg-elevated rounded text-[10px] font-bold text-textSecondary border border-border">
                        v{currentVersion.versionNumber}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                      <span className="text-xs font-medium text-textSecondary">Risk Assessment</span>
                      <div className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 font-bold border ${riskColor}`}>
                        {currentVersion.riskLevel === 'High' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {currentVersion.riskScore} / 100
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => onOpenContract(contract.id, currentVersion?.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-accent text-secondaryBg font-semibold rounded-lg text-sm hover:bg-accentSecondary transition-all"
                >
                  <span>Open Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUploadNewVersion(contract.id, contract.title)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-background hover:bg-elevated border border-border text-textSecondary font-medium rounded-lg text-xs transition-all"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    New Version
                  </button>
                  <button
                    onClick={() => onViewHistory(contract.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-background hover:bg-elevated border border-border text-textSecondary font-medium rounded-lg text-xs transition-all"
                  >
                    <History className="w-3.5 h-3.5" />
                    History
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
