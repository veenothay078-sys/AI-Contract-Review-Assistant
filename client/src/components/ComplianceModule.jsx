import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertCircle, XCircle, FileSearch, ArrowRight, ChevronRight } from 'lucide-react';

export default function ComplianceModule({ contract, onViewClauseDetails }) {
  if (!contract || !contract.compliance || contract.compliance.length === 0) return null;

  const compliance = contract.compliance;

  const stats = useMemo(() => {
    const total = compliance.length;
    const present = compliance.filter(c => c.status === 'PRESENT').length;
    const partial = compliance.filter(c => c.status === 'PARTIAL').length;
    const ambiguous = compliance.filter(c => c.status === 'AMBIGUOUS').length;
    const missing = compliance.filter(c => c.status === 'MISSING').length;

    // Calculate score: Present = 1, Partial = 0.5, Ambiguous = 0.25, Missing = 0
    const score = total > 0 
      ? Math.round(((present * 1 + partial * 0.5 + ambiguous * 0.25) / total) * 100) 
      : 0;

    return { total, present, partial, ambiguous, missing, score };
  }, [compliance]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'PARTIAL': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'AMBIGUOUS': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'MISSING': return <XCircle className="w-5 h-5 text-danger" />;
      default: return <ShieldAlert className="w-5 h-5 text-textMuted" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'text-success bg-success/10 border-success/20';
      case 'PARTIAL': return 'text-warning bg-warning/10 border-warning/20';
      case 'AMBIGUOUS': return 'text-warning bg-warning/10 border-warning/20';
      case 'MISSING': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-textMuted bg-card border-border';
    }
  };

  const missingOrPartial = compliance.filter(c => c.status !== 'PRESENT');
  
  // Sort missing/partial by priority
  const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
  missingOrPartial.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));

  const handleViewClause = (clauseId) => {
    if (!clauseId || !contract.clauses) return;
    const clause = contract.clauses.find(c => c.id === clauseId);
    if (clause && onViewClauseDetails) {
      onViewClauseDetails(clause);
    }
  };

  return (
    <section id="compliance-module" className="px-6 py-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border/50">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
            <ShieldAlert className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-textPrimary">Contract Compliance</h2>
            <p className="text-sm text-textMuted mt-0.5">Checking for standard provisions and missing clauses</p>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 bg-background border border-border/50 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-1">Overall Completeness</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-textPrimary">{stats.score}%</span>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-border"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-accent"
                  strokeDasharray={`${stats.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-background border border-border/50 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-bold text-textPrimary">{stats.total}</span>
              <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider mt-1">Checked</span>
            </div>
            <div className="bg-background border border-success/20 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-bold text-success">{stats.present}</span>
              <span className="text-[10px] text-success font-bold uppercase tracking-wider mt-1">Present</span>
            </div>
            <div className="bg-background border border-warning/20 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-bold text-warning">{stats.partial + stats.ambiguous}</span>
              <span className="text-[10px] text-warning font-bold uppercase tracking-wider mt-1">Partial/Ambig</span>
            </div>
            <div className="bg-background border border-danger/20 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-2xl font-bold text-danger">{stats.missing}</span>
              <span className="text-[10px] text-danger font-bold uppercase tracking-wider mt-1">Missing</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Missing/Partial Focus List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-accent" />
              Missing or Incomplete Provisions
            </h3>
            
            {missingOrPartial.length === 0 ? (
              <div className="bg-elevated border border-success/20 rounded-xl p-8 text-center shadow-subtle">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <h4 className="text-textPrimary font-medium">All standard provisions are present</h4>
                <p className="text-sm text-textMuted mt-1">This contract contains all the typical clauses expected for its type.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {missingOrPartial.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-background border border-border/50 rounded-xl p-5 transition-all duration-200 hover:border-border ${
                      item.status === 'MISSING' ? 'hover:border-danger/50' : 'hover:border-warning/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(item.status)}
                          <h4 className="text-base font-bold text-textPrimary">{item.provision}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      {item.priority && (
                         <span className={`text-[10px] px-2 py-1 rounded-md font-bold tracking-wider bg-card border ${
                           item.priority === 'HIGH' ? 'text-danger border-danger/30' : 
                           item.priority === 'MEDIUM' ? 'text-warning border-warning/30' : 
                           'text-success border-success/30'
                         }`}>
                           {item.priority} PRIORITY
                         </span>
                      )}
                    </div>
                    
                    <div className="bg-card/50 rounded-lg p-3 text-sm text-textSecondary mb-3 border border-border/50">
                      {item.explanation}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex-1 pr-4">
                        <span className="text-xs font-semibold text-textMuted block mb-1">Potential Impact:</span>
                        <p className="text-sm text-textPrimary">{item.impact}</p>
                      </div>
                      
                      {item.relatedClauseId && (
                        <button 
                          onClick={() => handleViewClause(item.relatedClauseId)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accentSecondary transition-colors whitespace-nowrap bg-accent/5 hover:bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20"
                        >
                          View Clause <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!item.relatedClauseId && item.status === 'MISSING' && (
                         <span className="text-xs text-textMuted italic">No related clause</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Full Checklist */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">All Provisions</h3>
            <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {compliance.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-3 border-b border-border/50 last:border-0 hover:bg-card/50 transition-colors ${
                      item.relatedClauseId ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => handleViewClause(item.relatedClauseId)}
                  >
                    <div className="flex items-center gap-2.5">
                      {getStatusIcon(item.status)}
                      <span className="text-sm font-medium text-textSecondary">{item.provision}</span>
                    </div>
                    {item.relatedClauseId && (
                      <ChevronRight className="w-4 h-4 text-textMuted opacity-50" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
