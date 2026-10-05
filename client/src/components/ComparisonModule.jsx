import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function ComparisonModule({ contracts, initialVersionA, initialVersionB, onShowNotification, onViewClauseDetails, onBack }) {
  const { token } = useAuth();
  const [versionAId, setVersionAId] = useState(initialVersionA || '');
  const [versionBId, setVersionBId] = useState(initialVersionB || '');
  
  const [versionAData, setVersionAData] = useState(null);
  const [versionBData, setVersionBData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Group all versions for the dropdowns
  const allVersions = contracts.flatMap(c => 
    c.versions.map(v => ({
      ...v,
      contractTitle: c.title,
      label: `${c.title} — Version ${v.versionNumber} (${new Date(v.uploadedAt).toLocaleDateString()})`
    }))
  );

  useEffect(() => {
    async function fetchVersions() {
      if (!versionAId || !versionBId) return;
      setIsLoading(true);
      try {
        const resA = await fetch(`${BACKEND_URL}/api/versions/${versionAId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataA = await resA.json();
        const resB = await fetch(`${BACKEND_URL}/api/versions/${versionBId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataB = await resB.json();
        
        setVersionAData(dataA.analysisData);
        setVersionBData(dataB.analysisData);
      } catch (err) {
        onShowNotification("Failed to fetch version data for comparison.", "error");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVersions();
  }, [versionAId, versionBId, onShowNotification]);

  const compareClauses = () => {
    if (!versionAData || !versionBData) return [];
    
    const clausesA = versionAData.clauses || [];
    const clausesB = versionBData.clauses || [];
    
    const allTitles = Array.from(new Set([...clausesA.map(c => c.title), ...clausesB.map(c => c.title)]));
    
    return allTitles.map(title => {
      const clauseA = clausesA.find(c => c.title === title);
      const clauseB = clausesB.find(c => c.title === title);
      
      let changeType = 'UNCHANGED';
      let riskImpact = 'NEUTRAL';
      
      if (clauseA && !clauseB) {
        changeType = 'REMOVED';
      } else if (!clauseA && clauseB) {
        changeType = 'ADDED';
      } else if (clauseA.description !== clauseB.description) {
        changeType = 'MODIFIED';
        if (clauseB.riskScore > clauseA.riskScore) riskImpact = 'HIGHER RISK';
        else if (clauseB.riskScore < clauseA.riskScore) riskImpact = 'LOWER RISK';
      }
      
      return { title, clauseA, clauseB, changeType, riskImpact };
    }).filter(c => c.changeType !== 'UNCHANGED');
  };

  const comparedClauses = compareClauses();

  return (
    <div id="comparison-view" className="px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-accent" /> Contract Comparison
        </h2>
        <button onClick={onBack} className="px-4 py-2 bg-card hover:bg-border border border-border rounded-xl text-sm font-semibold transition-all">
          Back to Dashboard
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-bold text-textSecondary mb-2">Contract A</label>
          <select 
            className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:border-accent"
            value={versionAId}
            onChange={(e) => setVersionAId(e.target.value)}
          >
            <option value="">Select Contract / Version</option>
            {allVersions.map(v => (
              <option key={v.id} value={v.id} disabled={v.id === versionBId}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-bold text-textSecondary mb-2">Contract B</label>
          <select 
            className="w-full bg-background border border-border rounded-lg p-2.5 text-sm"
            value={versionBId}
            onChange={(e) => setVersionBId(e.target.value)}
          >
            <option value="">Select Contract / Version</option>
            {allVersions.map(v => (
              <option key={v.id} value={v.id} disabled={v.id === versionAId}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="text-center py-10">Loading comparison...</div>}

      {versionAData && versionBData && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-textMuted uppercase mb-4">Risk Comparison</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-xs text-textMuted mb-1">Contract A</p>
                  <p className="text-2xl font-bold text-textPrimary">{versionAData.riskScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-textMuted mb-1">Contract B</p>
                  <p className="text-2xl font-bold text-textPrimary">{versionBData.riskScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-textMuted mb-1">Change</p>
                  <p className={`text-xl font-bold ${versionBData.riskScore > versionAData.riskScore ? 'text-danger' : 'text-success'}`}>
                    {versionBData.riskScore - versionAData.riskScore > 0 ? '+' : ''}{versionBData.riskScore - versionAData.riskScore}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-textMuted uppercase mb-4">Changes Summary</h3>
              <div className="flex justify-around items-center">
                <div className="text-center"><p className="text-2xl font-bold text-textPrimary">{comparedClauses.filter(c => c.changeType === 'MODIFIED').length}</p><p className="text-xs text-textMuted">Modified</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-textPrimary">{comparedClauses.filter(c => c.changeType === 'ADDED').length}</p><p className="text-xs text-textMuted">Added</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-textPrimary">{comparedClauses.filter(c => c.changeType === 'REMOVED').length}</p><p className="text-xs text-textMuted">Removed</p></div>
              </div>
            </div>
          </div>

          {/* Clause Comparison List */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background">
              <h3 className="font-bold text-textPrimary">Key Changes</h3>
            </div>
            <div className="divide-y divide-border">
              {comparedClauses.length === 0 ? (
                <div className="p-8 text-center text-textMuted">No significant clause differences found.</div>
              ) : (
                comparedClauses.map((change, idx) => (
                  <div key={idx} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-accent">{change.title}</h4>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-card border border-border rounded text-xs font-bold">{change.changeType}</span>
                        {change.riskImpact !== 'NEUTRAL' && (
                          <span className={`px-2.5 py-1 rounded text-xs font-bold border ${change.riskImpact === 'HIGHER RISK' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-success/10 text-success border-success/20'}`}>
                            {change.riskImpact}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background border border-border/50 p-4 rounded-xl relative cursor-pointer hover:border-border transition-colors" onClick={() => change.clauseA && onViewClauseDetails(change.clauseA)}>
                        <span className="absolute -top-3 left-4 px-2 bg-card text-[10px] font-bold text-textMuted border border-border/50 rounded">Contract A</span>
                        <p className="text-sm text-textSecondary">{change.clauseA ? change.clauseA.description : 'Missing / Not Present'}</p>
                      </div>
                      <div className="bg-background border border-border/50 p-4 rounded-xl relative cursor-pointer hover:border-border transition-colors" onClick={() => change.clauseB && onViewClauseDetails(change.clauseB)}>
                        <span className="absolute -top-3 left-4 px-2 bg-card text-[10px] font-bold text-textMuted border border-border/50 rounded">Contract B</span>
                        <p className="text-sm text-textSecondary">{change.clauseB ? change.clauseB.description : 'Missing / Not Present'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
