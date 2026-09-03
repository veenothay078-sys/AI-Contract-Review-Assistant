import React from 'react';
import { LayoutDashboard, FilePlus2, ShieldCheck, FileText, CalendarDays, CheckSquare, MessageSquare, Briefcase, Settings, User } from 'lucide-react';

export default function Sidebar({ view, currentContract, setView, onUploadNew }) {

  const handleNav = (targetView) => {
    setView(targetView);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-secondaryBg border-r border-border h-full flex flex-col transition-all duration-300">

      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <span className="font-bold text-textPrimary tracking-tight">Contract Assist</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6 custom-scrollbar">

        {/* Workspace */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Workspace</h3>
          <nav className="space-y-1">
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-accent/10 text-accent' : 'text-textSecondary hover:bg-card hover:text-textPrimary'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={onUploadNew}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${view === 'upload' ? 'bg-accent/10 text-accent' : 'text-textSecondary hover:bg-card hover:text-textPrimary'}`}
            >
              <FilePlus2 className="w-4 h-4" /> New Contract
            </button>
          </nav>
        </div>

        {/* Current Contract Analysis */}
        {currentContract && view === 'analysis' && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 line-clamp-1" title={currentContract.title}>
              {currentContract.title}
            </h3>
            <nav className="space-y-1 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border/50 z-0" />

              <button onClick={() => scrollTo('summary-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Overview
              </button>
              <button onClick={() => scrollTo('dashboard-view')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Risk Dashboard
              </button>
              <button onClick={() => scrollTo('clauses-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Clauses
              </button>
              <button onClick={() => scrollTo('dates-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Dates & Obligations
              </button>
              <button onClick={() => scrollTo('compliance-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Compliance
              </button>
              <button onClick={() => scrollTo('qa-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> AI Chat
              </button>
              <button onClick={() => scrollTo('recommendations-module')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-all relative z-10">
                <span className="w-2 h-2 rounded-full bg-border mr-1" /> Negotiation
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-border">
        <button 
          onClick={() => setView('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${view === 'profile' ? 'bg-accent/10 text-accent' : 'text-textSecondary hover:bg-card hover:text-textPrimary'}`}
        >
          <User className="w-4 h-4" /> Profile
        </button>
      </div>

    </aside>
  );
}
