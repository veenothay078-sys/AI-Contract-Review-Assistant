import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  ShieldAlert, TrendingUp, Info, AlertTriangle, CheckCircle, 
  ShieldCheck, Shield, ChevronDown, ChevronUp, Copy, ExternalLink, Eye
} from 'lucide-react';

export default function DashboardModule({ contract, onShowNotification, onViewClauseDetails }) {
  if (!contract) return null;

  const [expandedClause, setExpandedClause] = useState(null);

  const {
    riskScore,
    riskLevel,
    statistics,
    clauses,
    chartData
  } = contract;

  const strokeDashoffset = 440 - (440 * riskScore) / 100;

  const getRiskLevelBadge = (level) => {
    switch (level) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-success/20 text-success border border-success/30">
            <CheckCircle className="w-3.5 h-3.5 text-success" />
            <span>Low Risk</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-warning/20 text-warning border border-warning/30">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <span>Medium Risk</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-danger/20 text-danger border border-danger/30">
            <ShieldAlert className="w-3.5 h-3.5 text-danger" />
            <span>High Risk</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getClauseRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return {
          bg: 'bg-background hover:bg-elevated/50',
          border: 'border-success/30 hover:border-success/50',
          badge: 'bg-success/10 text-success border border-success/20',
          indicator: 'bg-success'
        };
      case 'Medium':
        return {
          bg: 'bg-background hover:bg-elevated/50',
          border: 'border-warning/30 hover:border-warning/50',
          badge: 'bg-warning/10 text-warning border border-warning/20',
          indicator: 'bg-warning'
        };
      case 'High':
        return {
          bg: 'bg-background hover:bg-elevated/50',
          border: 'border-danger/30 hover:border-danger/50',
          badge: 'bg-danger/10 text-danger border border-danger/20',
          indicator: 'bg-danger'
        };
      default:
        return {
          bg: 'bg-background',
          border: 'border-border',
          badge: 'bg-elevated text-textSecondary border border-border',
          indicator: 'bg-textMuted'
        };
    }
  };

  const toggleClauseExpand = (id) => {
    setExpandedClause(expandedClause === id ? null : id);
  };

  const handleCopyClause = (title, desc) => {
    navigator.clipboard.writeText(`${title}: ${desc}`);
    onShowNotification("Clause details copied to clipboard!");
  };

  return (
    <div id="dashboard-view" className="px-6 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-accent" />
            <span>Risk Analysis Dashboard</span>
          </h2>
          <p className="text-sm text-textMuted mt-1">Deep analysis of potential compliance conflicts and legal hazards.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-textMuted bg-elevated px-3.5 py-2 rounded-xl border border-border shadow-sm">
          <Info className="w-4 h-4 text-textMuted" />
          <span>Scores are calibrated to ISO 27001 &amp; Contract Law Best Practices</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Risk Index Circular Progress */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="font-bold text-textPrimary text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-textMuted" />
              <span>Overall Protection Index</span>
            </h3>
            <p className="text-xs text-textMuted mt-1">Higher is safer, representing lower risk.</p>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="text-border"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  className={`${
                    riskScore >= 80 ? "text-success" : riskScore >= 60 ? "text-warning" : "text-danger"
                  }`}
                  strokeWidth="12"
                  strokeDasharray="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              {/* Inner score */}
              <div className="absolute text-center">
                <span className="text-4xl sm:text-5xl font-extrabold text-textPrimary tracking-tight">
                  {riskScore}
                </span>
                <span className="text-textMuted block text-xs font-semibold uppercase tracking-wider mt-0.5">
                  of 100 pts
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              {getRiskLevelBadge(riskLevel)}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between text-xs font-semibold text-textMuted">
              <span>Risk Evaluation:</span>
              <span className="text-textPrimary font-bold">{riskLevel === 'Low' ? 'Approved (Low)' : riskLevel === 'Medium' ? 'Needs Review' : 'Caution Required'}</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Radar Chart / Statistics */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-textPrimary text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-textMuted" />
              <span>Clause Risk Profile Matrix</span>
            </h3>
            <p className="text-xs text-textMuted mt-1">Strengths and protection levels by core domain areas.</p>
          </div>

          {/* Recharts Radar/Bar chart */}
          <div className="h-64 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.85}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.45}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: '1px solid #334155', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    color: '#F8FAFC'
                  }}
                  labelStyle={{ color: '#CBD5E1' }}
                  itemStyle={{ color: '#22D3EE' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="url(#colorScore)">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score >= 80 ? '#22C55E' : entry.score >= 60 ? '#F59E0B' : '#EF4444'} 
                      opacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-3.5 bg-success/10 rounded-2xl border border-success/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-success">{statistics.lowRisks}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-textMuted block uppercase tracking-wider mt-0.5">Low Risks</span>
            </div>
            <div className="p-3.5 bg-warning/10 rounded-2xl border border-warning/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-warning">{statistics.mediumRisks}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-textMuted block uppercase tracking-wider mt-0.5">Med Risks</span>
            </div>
            <div className="p-3.5 bg-danger/10 rounded-2xl border border-danger/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-danger">{statistics.highRisks}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-textMuted block uppercase tracking-wider mt-0.5">High Risks</span>
            </div>
            <div className="p-3.5 bg-card rounded-2xl border border-border text-center">
              <span className="text-xl sm:text-2xl font-bold text-textPrimary">{statistics.criticalClauses}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-textMuted block uppercase tracking-wider mt-0.5">Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Cards Clauses list */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-textPrimary text-lg">Clause Analysis Details</h3>
          <p className="text-xs text-textMuted mt-1">Reviewing key sections for legal protection and alignment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clauses.map((c) => {
            const styles = getClauseRiskColor(c.riskLevel);
            const isExpanded = expandedClause === c.id;

            return (
              <div 
                key={c.id} 
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${styles.bg} ${styles.border} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="font-bold text-textPrimary text-sm sm:text-base">{c.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles.badge}`}>
                      {c.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-textSecondary line-clamp-3 leading-relaxed font-medium">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3.5 mt-4">
                  <button 
                    onClick={() => toggleClauseExpand(c.id)}
                    className="text-xs font-semibold text-textMuted hover:text-textSecondary transition-colors flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Hide Details" : "Read Breakdown"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex items-center gap-3">
                    {onViewClauseDetails && (
                      <button 
                        onClick={() => onViewClauseDetails(c)}
                        className="p-1.5 hover:bg-elevated rounded-lg text-accent hover:text-accentSecondary transition-all"
                        title="View Clause Risk Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleCopyClause(c.title, c.description)}
                      className="p-1.5 hover:bg-elevated rounded-lg text-textMuted hover:text-textSecondary transition-all"
                      title="Copy Clause Data"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a 
                      href="#upload-section" 
                      className="p-1.5 hover:bg-elevated rounded-lg text-textMuted hover:text-textSecondary transition-all"
                      title="Go to Contract Source"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Expanding breakdown explanation */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-4 pt-3 border-t border-dashed border-border"
                    >
                      <h5 className="text-xs font-bold text-textSecondary uppercase tracking-wide mb-1">AI Recommendation:</h5>
                      <p className="text-xs text-textMuted leading-relaxed">
                        {c.riskLevel === 'High' 
                          ? 'This clause poses significant compliance liabilities. We highly recommend negotiating to cap liabilities or remove early termination penalties.'
                          : c.riskLevel === 'Medium'
                          ? 'Review scope parameters to ensure terms do not automatically bind the company to unfavorable renewals without notification.'
                          : 'This is a standard market protection clause. Acceptable under ordinary risk parameters.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
