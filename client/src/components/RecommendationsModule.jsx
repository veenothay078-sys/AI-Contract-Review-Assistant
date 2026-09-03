import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, ArrowRight, BookOpen, Handshake } from 'lucide-react';

export default function RecommendationsModule({ contract, onViewClauseDetails }) {
  if (!contract || !contract.recommendations || contract.recommendations.length === 0) return null;

  const recommendations = contract.recommendations;

  const stats = useMemo(() => {
    const high = recommendations.filter(r => r.priority === 'HIGH').length;
    const medium = recommendations.filter(r => r.priority === 'MEDIUM').length;
    const low = recommendations.filter(r => r.priority === 'LOW').length;
    return { high, medium, low };
  }, [recommendations]);

  const sortedRecommendations = useMemo(() => {
    const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    return [...recommendations].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }, [recommendations]);

  const handleViewClause = (clauseId) => {
    if (!clauseId || !contract.clauses) return;
    const clause = contract.clauses.find(c => c.id === clauseId);
    if (clause && onViewClauseDetails) {
      onViewClauseDetails(clause);
    }
  };

  const getPriorityColors = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-danger bg-danger/10 border-danger/20';
      case 'MEDIUM': return 'text-warning bg-warning/10 border-warning/20';
      case 'LOW': return 'text-success bg-success/10 border-success/20';
      default: return 'text-textMuted bg-card border-border';
    }
  };

  return (
    <section id="recommendations-module" className="px-6 py-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 pb-5 border-b border-border/50">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
            <Handshake className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-textPrimary">AI Negotiation Recommendations</h2>
            <p className="text-sm text-textMuted mt-0.5">Practical suggestions for contract improvement and risk mitigation</p>
          </div>
        </div>

      <div className="space-y-6">
        
        {/* Priority Summary */}
        <div className="bg-background border border-border/50 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-textPrimary mb-1">Negotiation Priorities</h3>
            <p className="text-sm text-textMuted">Top issues to negotiate before signing the agreement.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-danger/5 border border-danger/20 rounded-xl min-w-[100px]">
              <span className="block text-2xl font-bold text-danger">{stats.high}</span>
              <span className="text-xs font-semibold text-danger tracking-wider uppercase">High Priority</span>
            </div>
            <div className="text-center px-4 py-2 bg-warning/5 border border-warning/20 rounded-xl min-w-[100px]">
              <span className="block text-2xl font-bold text-warning">{stats.medium}</span>
              <span className="text-xs font-semibold text-warning tracking-wider uppercase">Medium Priority</span>
            </div>
            <div className="text-center px-4 py-2 bg-success/5 border border-success/20 rounded-xl min-w-[100px]">
              <span className="block text-2xl font-bold text-success">{stats.low}</span>
              <span className="text-xs font-semibold text-success tracking-wider uppercase">Low Priority</span>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedRecommendations.map((rec, idx) => {
            const relatedClause = rec.clauseId && contract.clauses ? contract.clauses.find(c => c.id === rec.clauseId) : null;
            
            return (
              <motion.div 
                key={rec.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-background border border-border/50 rounded-xl p-6 transition-colors hover:border-border flex flex-col h-full"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    {relatedClause ? (
                      <div className="text-sm font-semibold text-accent mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {relatedClause.title} {relatedClause.section !== 'Not specified' ? `- ${relatedClause.section}` : ''}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-textMuted mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Missing/General Provision
                      </div>
                    )}
                    <h4 className="text-base font-bold text-textPrimary leading-tight">{rec.issue}</h4>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold tracking-wider border ${getPriorityColors(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider block mb-1">Potential Impact</span>
                    <p className="text-sm text-textSecondary">{rec.impact}</p>
                  </div>
                  
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Recommended Action
                    </span>
                    <p className="text-sm text-textPrimary">{rec.recommendation}</p>
                  </div>

                  {rec.suggestedLanguage && rec.suggestedLanguage !== 'N/A' && (
                    <div className="bg-card border border-border/50 rounded-lg p-3">
                      <span className="text-xs font-semibold text-textMuted uppercase tracking-wider block mb-1">Suggested Negotiation Language</span>
                      <p className="text-sm font-medium text-textSecondary italic">"{rec.suggestedLanguage}"</p>
                    </div>
                  )}
                </div>

                {relatedClause && (
                  <div className="mt-5 pt-4 border-t border-border/50 flex justify-end">
                    <button 
                      onClick={() => handleViewClause(rec.clauseId)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accentSecondary transition-colors"
                    >
                      View Original Clause <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
      </motion.div>
    </section>
  );
}
