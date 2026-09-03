import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, CalendarDays, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile({ onBack }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Your Profile</h1>
          <p className="text-sm text-textMuted mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Header section with avatar */}
        <div className="p-8 sm:p-10 border-b border-border bg-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-accent text-secondaryBg flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-background">
              {getInitials(user.name)}
            </div>
            <div className="text-center sm:text-left pt-2">
              <h2 className="text-2xl font-bold text-textPrimary">{user.name}</h2>
              <p className="text-textSecondary mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-success/10 text-success border border-success/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Pro Workspace
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-8 sm:p-10 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-textPrimary mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 text-sm font-medium text-textSecondary mb-1">
                  <User className="w-4 h-4 text-textMuted" /> Full Name
                </div>
                <div className="text-base text-textPrimary font-semibold pl-7">{user.name}</div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 text-sm font-medium text-textSecondary mb-1">
                  <Building className="w-4 h-4 text-textMuted" /> Company
                </div>
                <div className="text-base text-textPrimary font-semibold pl-7">{user.company || 'Not specified'}</div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 text-sm font-medium text-textSecondary mb-1">
                  <Mail className="w-4 h-4 text-textMuted" /> Email Address
                </div>
                <div className="text-base text-textPrimary font-semibold pl-7">{user.email}</div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 text-sm font-medium text-textSecondary mb-1">
                  <CalendarDays className="w-4 h-4 text-textMuted" /> Member Since
                </div>
                <div className="text-base text-textPrimary font-semibold pl-7">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">Danger Zone</h3>
            <div className="p-5 rounded-lg border border-danger/30 bg-danger/5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-bold text-textPrimary">Log out of all devices</h4>
                <p className="text-xs text-textSecondary mt-1 max-w-md">You will be required to enter your password the next time you sign in.</p>
              </div>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-danger hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
