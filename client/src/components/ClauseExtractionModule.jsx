import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Filter, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ClauseExtractionModule({ contract, onViewClauseDetails }) {
  if (!contract) return null;

  const { clauses = [] } = contract;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    'All',
    'Financial',
    'Legal',
    'Operational',
    'Compliance',
    'High Risk',
    'Medium Risk',
    'Low Risk'
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-success/10 text-success border border-success/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'High':
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-elevated text-textSecondary border border-border';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'FINANCIAL':
        return 'bg-accent/10 text-accent border border-accent/20';
      case 'LEGAL':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'OPERATIONAL':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'COMPLIANCE':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'CONFIDENTIALITY':
        return 'bg-accentSecondary/10 text-accentSecondary border border-accentSecondary/20';
      case 'TERMINATION':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-elevated text-textMuted border border-border';
    }
  };

  // Filtering Logic
  const filteredClauses = clauses.filter((c) => {
    // Search query check
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.section && c.section.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter type check
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Financial') return c.category === 'FINANCIAL';
    if (activeFilter === 'Legal') return c.category === 'LEGAL';
    if (activeFilter === 'Operational') return c.category === 'OPERATIONAL';
    if (activeFilter === 'Compliance') return c.category === 'COMPLIANCE';
    if (activeFilter === 'High Risk') return c.riskLevel === 'High';
    if (activeFilter === 'Medium Risk') return c.riskLevel === 'Medium';
    if (activeFilter === 'Low Risk') return c.riskLevel === 'Low';
    return true;
  });

  return (
    <div id="clauses-module" className="px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6"
      >
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-textPrimary flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <span>Extracted Contract Clauses</span>
            </h2>
            <p className="text-sm text-textMuted mt-1">
              AI-identified legal components categorized and evaluated for overall risk thresholds.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses or terms..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl text-textPrimary placeholder-textMuted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 active:scale-95 ${
                activeFilter === filter
                  ? 'bg-accent text-secondaryBg border-accent'
                  : 'bg-card text-textSecondary border-border hover:bg-border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Clauses Grid */}
        <AnimatePresence mode="wait">
          {filteredClauses.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClauses.map((c) => (
                <motion.div
                  layout
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background border border-border/50 rounded-xl p-5 flex flex-col justify-between hover:border-border hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">
                        {c.section || 'General'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getCategoryBadgeColor(c.category)}`}>
                        {c.category || 'LEGAL'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-textPrimary text-base line-clamp-1">{c.title}</h4>
                      <p className="text-xs sm:text-sm text-textSecondary line-clamp-3 leading-relaxed mt-2 font-medium">
                        "{c.description}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-5">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRiskColor(c.riskLevel)}`}>
                        {c.riskLevel}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewClauseDetails(c)}
                      className="px-3 py-1.5 bg-card hover:bg-elevated text-xs font-semibold text-textSecondary hover:text-textPrimary rounded-lg border border-border transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-card rounded-2xl border border-border"
            >
              <p className="text-sm text-textMuted">No clauses match the search or filter parameters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
