import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import UploadModule from './components/UploadModule';
import Skeletons from './components/Skeletons';
import SummaryModule from './components/SummaryModule';
import DashboardModule from './components/DashboardModule';
import ClauseExtractionModule from './components/ClauseExtractionModule';
import DatesObligationsModule from './components/DatesObligationsModule';
import ClauseDetailsModal from './components/ClauseDetailsModal';
import QAModule from './components/QAModule';
import ComplianceModule from './components/ComplianceModule';
import RecommendationsModule from './components/RecommendationsModule';
import Toast from './components/Toast';
import MyContracts from './components/MyContracts';
import VersionHistoryModal from './components/VersionHistoryModal';
import ComparisonModule from './components/ComparisonModule';
import ExecutiveReport from './components/ExecutiveReport';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, ServerCrash, Loader2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/Profile';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const PIPELINE_STAGES = [
  "Uploading document...",
  "Extracting text from PDF...",
  "Identifying document type...",
  "Extracting contract clauses...",
  "Analyzing risk factors...",
  "Generating executive summary...",
  "Analysis Complete ✓",
];

export default function App() {
  const { user, token, loading } = useAuth();
  
  const [contracts, setContracts] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'upload', 'analysis', 'comparison', 'report', 'login', 'register', 'profile'
  
  const [currentContract, setCurrentContract] = useState(null);
  const [existingContractForUpload, setExistingContractForUpload] = useState({ id: null, title: null });
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedContractForHistory, setSelectedContractForHistory] = useState(null);
  const [comparisonVersions, setComparisonVersions] = useState({ a: null, b: null });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [analysisError, setAnalysisError] = useState(null);
  const [selectedClauseForDetails, setSelectedClauseForDetails] = useState(null);
  const [isClauseDetailsModalOpen, setIsClauseDetailsModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const fetchContracts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/contracts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
        if (data.length === 0 && view === 'dashboard') {
          setView('upload');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      if (view === 'login' || view === 'register') {
        setView('dashboard');
      }
      fetchContracts();
    } else {
      if (view !== 'login' && view !== 'register') {
        setView('login');
      }
    }
  }, [user]);

  const startPipelineAnimation = () => {
    let stage = 0;
    setPipelineStage(0);
    const interval = setInterval(() => {
      stage += 1;
      if (stage >= PIPELINE_STAGES.length - 1) {
        clearInterval(interval);
      } else {
        setPipelineStage(stage);
      }
    }, 1500);
    return interval;
  };

  const handleAnalysisStart = async (uploadedFile, existingContractId = null) => {
    setCurrentContract(null);
    setAnalysisError(null);
    setIsAnalyzing(true);
    setPipelineStage(0);
    setView('analysis');

    const stageTimer = startPipelineAnimation();

    try {
      const formData = new FormData();
      formData.append('contract', uploadedFile);
      if (existingContractId) {
        formData.append('contractId', existingContractId);
      }

      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      clearInterval(stageTimer);
      const json = await response.json();

      if (!response.ok) {
        setAnalysisError({
          code: json.error || 'unknown',
          message: json.message || 'An unexpected error occurred during analysis.',
        });
        setIsAnalyzing(false);
        return;
      }

      if (!json.documentType || !json.clauses) {
        setAnalysisError({
          code: 'malformed_response',
          message: 'The AI returned an incomplete analysis. Please try again.',
        });
        setIsAnalyzing(false);
        return;
      }

      setPipelineStage(PIPELINE_STAGES.length - 1);
      await new Promise(r => setTimeout(r, 600));

      setCurrentContract(json);
      setIsAnalyzing(false);
      setExistingContractForUpload({ id: null, title: null });
      fetchContracts();
      showToast("Contract analysis report generated successfully!");
    } catch (networkError) {
      clearInterval(stageTimer);
      setAnalysisError({
        code: 'network_error',
        message: `Cannot connect to the analysis server. Make sure the backend is running on ${BACKEND_URL}. Run: npm run server`,
      });
      setIsAnalyzing(false);
    }
  };

  const handleOpenContract = async (contractId, versionId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/versions/${versionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentContract(data.analysisData);
        setView('analysis');
      }
    } catch (e) {
      showToast("Failed to load contract version", "error");
    }
  };

  const handleUploadNewVersion = (contractId, contractTitle) => {
    setExistingContractForUpload({ id: contractId, title: contractTitle });
    setView('upload');
  };

  const handleViewHistory = (contractId) => {
    const c = contracts.find(x => x.id === contractId);
    setSelectedContractForHistory(c);
    setIsVersionHistoryOpen(true);
  };

  const handleCompare = (versionAId, versionBId) => {
    setComparisonVersions({ a: versionAId, b: versionBId });
    setView('comparison');
  };

  const handleScrollToUpload = () => {
    setExistingContractForUpload({ id: null, title: null });
    setView('upload');
  };

  const openClauseDetails = (clause) => {
    setSelectedClauseForDetails(clause);
    setIsClauseDetailsModalOpen(true);
  };

  const closeClauseDetails = () => {
    setIsClauseDetailsModalOpen(false);
    setSelectedClauseForDetails(null);
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {view === 'register' ? (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Register onNavigate={setView} />
          </motion.div>
        ) : (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onNavigate={setView} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden selection:bg-primary/20">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        view={view} 
        currentContract={currentContract} 
        setView={setView} 
        onUploadNew={() => { setExistingContractForUpload({id: null, title: null}); setView('upload'); }} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative custom-scrollbar bg-background">
        
        {/* Top Header */}
        <TopHeader view={view} setView={setView} currentContract={currentContract} />

        {/* Content Wrapper */}
        <main className="flex-1 pb-16">
          
          <AnimatePresence mode="wait">
            
            {/* ─── DASHBOARD ─── */}
            {view === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {contracts.length === 0 ? (
                  <Hero onScrollToUpload={handleScrollToUpload} />
                ) : (
                  <MyContracts 
                    contracts={contracts} 
                    onOpenContract={handleOpenContract}
                    onUploadNewVersion={handleUploadNewVersion}
                    onViewHistory={handleViewHistory}
                    onOpenComparison={() => setView('comparison')}
                  />
                )}
              </motion.div>
            )}

            {/* ─── UPLOAD ─── */}
            {view === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UploadModule 
                  onAnalysisComplete={handleAnalysisStart}
                  onShowNotification={showToast}
                  existingContractId={existingContractForUpload.id}
                  existingContractTitle={existingContractForUpload.title}
                />
              </motion.div>
            )}

            {/* ─── COMPARISON ─── */}
            {view === 'comparison' && (
              <motion.div key="comparison" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ComparisonModule 
                   contracts={contracts}
                   initialVersionA={comparisonVersions.a}
                   initialVersionB={comparisonVersions.b}
                   onShowNotification={showToast}
                   onViewClauseDetails={openClauseDetails}
                   onBack={() => setView('dashboard')}
                />
              </motion.div>
            )}

            {/* ─── REPORT ─── */}
            {view === 'report' && currentContract && (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ExecutiveReport 
                  contract={currentContract} 
                  onBack={() => setView('analysis')}
                />
              </motion.div>
            )}

            {/* ─── PROFILE ─── */}
            {view === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Profile onBack={() => setView('dashboard')} />
              </motion.div>
            )}

            {/* ─── ANALYSIS ─── */}
            {(view === 'analysis' || isAnalyzing || analysisError) && (
              <motion.div id="analysis-container" className="max-w-6xl mx-auto" key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                
                <AnimatePresence mode="wait">
                  
                  {/* Loading State */}
                  {isAnalyzing && (
                    <motion.div
                      key="analyzing-loader"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-3 mb-8">
                        <div className="relative flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                          <Sparkles className="w-5 h-5 text-accentSecondary absolute animate-pulse" />
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.h3
                            key={pipelineStage}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="text-xl font-bold text-textPrimary"
                          >
                            {PIPELINE_STAGES[pipelineStage]}
                          </motion.h3>
                        </AnimatePresence>
                        <div className="flex flex-col items-start gap-2 mt-4 bg-card border border-border rounded-xl px-6 py-5 text-left shadow-sm">
                          {PIPELINE_STAGES.slice(0, -1).map((stage, idx) => (
                            <div key={idx} className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${
                              idx < pipelineStage ? 'text-success' : idx === pipelineStage ? 'text-accent animate-pulse' : 'text-textMuted'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                idx < pipelineStage ? 'bg-success' : idx === pipelineStage ? 'bg-accent' : 'bg-border'
                              }`} />
                              {stage}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-textMuted mt-2">Processing legal logic mapping...</p>
                      </div>
                      <Skeletons />
                    </motion.div>
                  )}

                  {/* Error State */}
                  {analysisError && !isAnalyzing && (
                    <motion.div
                      key="error-state"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="max-w-2xl mx-auto px-4 py-20 text-center"
                    >
                      <div className="border border-danger/30 bg-card rounded-xl p-10 shadow-sm flex flex-col items-center">
                        <div className="p-4 bg-danger/10 rounded-full mb-5">
                          {analysisError.code === 'network_error' ? <ServerCrash className="w-8 h-8 text-danger" /> : <AlertTriangle className="w-8 h-8 text-danger" />}
                        </div>
                        <h3 className="text-xl font-semibold text-textPrimary mb-2">Analysis Failed</h3>
                        <p className="text-sm text-textSecondary max-w-md leading-relaxed">{analysisError.message}</p>
                        <button
                          onClick={() => { setAnalysisError(null); setView('upload'); }}
                          className="mt-8 px-5 py-2.5 bg-background hover:bg-elevated text-textPrimary font-semibold border border-border rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>Try Again</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Analysis Results */}
                  {currentContract && !isAnalyzing && !analysisError && (
                    <motion.div
                      key="analysis-result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-2 pb-12"
                    >
                      {/* Document Context Banner */}
                      <div className="px-6 pt-6 pb-2">
                        <div className="bg-elevated border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Document Profile:</span>
                            <span className="text-sm font-semibold text-textPrimary">{currentContract.documentType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-textMuted">Confidence:</span>
                            <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded">{currentContract.confidence ?? 'N/A'}%</span>
                          </div>
                        </div>
                      </div>

                      <SummaryModule contract={currentContract} onShowNotification={showToast} />
                      <DashboardModule contract={currentContract} onShowNotification={showToast} onViewClauseDetails={openClauseDetails} />
                      <ClauseExtractionModule contract={currentContract} onViewClauseDetails={openClauseDetails} />
                      <DatesObligationsModule contract={currentContract} />
                      <ComplianceModule contract={currentContract} onViewClauseDetails={openClauseDetails} />
                      <QAModule contractText={currentContract.contractText} onViewClauseDetails={openClauseDetails} />
                      <RecommendationsModule contract={currentContract} onViewClauseDetails={openClauseDetails} />
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!currentContract && !isAnalyzing && !analysisError && (
                    <motion.div key="empty-state" className="max-w-2xl mx-auto px-4 py-24 text-center">
                      <div className="border border-border bg-card rounded-xl p-12 shadow-sm flex flex-col items-center justify-center">
                        <div className="bg-elevated p-4 rounded-full text-textMuted mb-6">
                          <ShieldCheck className="w-10 h-10 text-border" />
                        </div>
                        <h3 className="text-xl font-semibold text-textPrimary">No active review</h3>
                        <p className="text-sm text-textMuted max-w-sm mt-3 leading-relaxed">
                          Select a contract from your dashboard or upload a new one to begin deep legal analysis.
                        </p>
                        <button
                          onClick={() => setView('upload')}
                          className="mt-8 px-6 py-2.5 bg-accent hover:bg-accentSecondary text-secondaryBg font-semibold rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <span>Upload Contract</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <Toast 
            message={toastMessage} 
            type={toastType} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>

      <ClauseDetailsModal
        clause={selectedClauseForDetails}
        isOpen={isClauseDetailsModalOpen}
        onClose={closeClauseDetails}
      />

      <VersionHistoryModal 
         isOpen={isVersionHistoryOpen}
         onClose={() => setIsVersionHistoryOpen(false)}
         contract={selectedContractForHistory}
         onViewVersion={handleOpenContract}
         onCompare={handleCompare}
      />
    </div>
  );
}
