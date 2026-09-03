import React, { useState } from 'react';
import { Brain, Bell, Shield, Sparkles, User, Info } from 'lucide-react';

export default function Navbar({ onShowNotification }) {
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const handleNotificationClick = () => {
    setUnreadNotifications(0);
    if (onShowNotification) {
      onShowNotification("You have 2 new contract analysis reviews waiting for confirmation.");
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-secondaryBg/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary to-accent p-2.5 rounded-premium text-white shadow-md shadow-primary/20">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-textPrimary via-textSecondary to-accent bg-clip-text text-transparent">
                Contract Review Assist
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                AI
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-textSecondary hover:text-textPrimary hover:bg-elevated rounded-full transition-all duration-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-critical"></span>
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-border" />

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-textMuted font-medium">Enterprise Security</span>
                <span className="text-sm font-semibold text-textPrimary">Compliance Officer</span>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-accentSecondary flex items-center justify-center text-secondaryBg font-semibold text-sm shadow-sm ring-2 ring-border hover:ring-accent/30 transition-all">
                  JD
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border rounded-xl shadow-xl py-1 hidden group-hover:block transition-all glass-panel-dark">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-textMuted">Signed in as</p>
                    <p className="text-sm font-semibold text-textPrimary">compliance.lead@securecorp.com</p>
                  </div>
                  <a href="#about" className="flex items-center gap-2 px-4 py-2 text-sm text-textSecondary hover:bg-card">
                    <Info className="w-4 h-4" /> Enterprise Suite
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
