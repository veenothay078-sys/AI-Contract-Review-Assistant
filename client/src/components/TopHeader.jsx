import React from 'react';
import { Search, Bell, Download, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TopHeader({ view, setView, currentContract }) {
  const { user } = useAuth();
  
  const getBreadcrumbs = () => {
    if (view === 'dashboard') return 'Workspace / Dashboard';
    if (view === 'upload') return 'Workspace / New Contract Upload';
    if (view === 'comparison') return 'Workspace / Contract Comparison';
    if (view === 'report') return `Workspace / ${currentContract?.title || 'Contract'} / Executive Report`;
    if (view === 'analysis' && currentContract) return `Workspace / ${currentContract.title} / Version ${currentContract.versionNumber || '1'}`;
    return 'Workspace';
  };

  const parts = getBreadcrumbs().split(' / ');

  return (
    <header className="h-16 flex-shrink-0 bg-background border-b border-border flex items-center justify-between px-6 z-10 sticky top-0">
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm">
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <span className={`${idx === parts.length - 1 ? 'text-textPrimary font-semibold' : 'text-textMuted font-medium'}`}>
              {part}
            </span>
            {idx < parts.length - 1 && (
              <ChevronRight className="w-4 h-4 text-textMuted mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search contracts..." 
            className="bg-card border border-border text-textPrimary text-sm rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-accent transition-colors placeholder:text-textMuted"
          />
        </div>

        {/* Notifs */}
        <button className="p-2 text-textMuted hover:text-textPrimary hover:bg-card rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-background"></span>
        </button>

        {/* Global Action for Analysis View */}
        {view === 'analysis' && currentContract && (
          <button 
            onClick={() => setView('report')} 
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-card border border-border text-textSecondary hover:bg-elevated hover:text-textPrimary font-semibold rounded-lg text-sm transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" /> 
            Executive Report
          </button>
        )}

        {/* User Profile Snippet */}
        {user && (
          <div className="ml-4 pl-4 border-l border-border flex items-center gap-3 cursor-pointer" onClick={() => setView('profile')}>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-textPrimary leading-none">{user.name}</span>
              <span className="text-xs text-textMuted mt-1">{user.company || 'Personal'}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent text-secondaryBg flex items-center justify-center text-sm font-bold shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        )}
      </div>
      
    </header>
  );
}
