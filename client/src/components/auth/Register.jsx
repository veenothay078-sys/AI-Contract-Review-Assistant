import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Building, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    const result = await register(name, email, password, company);
    setLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
        
      {/* Left branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-elevated border-r border-border relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-accent/10 rounded-2xl shadow-inner border border-accent/20">
              <ShieldCheck className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-textPrimary tracking-tight">Contract Assist</h1>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary mb-6 leading-tight">Start your free workspace.</h2>
          <p className="text-textSecondary leading-relaxed text-lg">
            Upload your contracts, identify risks instantly, and ensure compliance without the hefty legal fees.
          </p>
        </div>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>

      {/* Right register form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="p-2 bg-accent/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-textPrimary">Contract Assist</h1>
          </div>

          <h2 className="text-3xl font-bold text-textPrimary mb-3">Create an account</h2>
          <p className="text-base text-textMuted mb-8">Set up your secure contract workspace</p>
          
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-sm font-medium text-danger flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-2.5">Full Name <span className="text-danger">*</span></label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textMuted" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-textPrimary transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-2.5">Email Address <span className="text-danger">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textMuted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-textPrimary transition-all shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-2.5">Password <span className="text-danger">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textMuted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-textPrimary transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-textSecondary mb-2.5">Company (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textMuted" />
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-textPrimary transition-all shadow-sm"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accentSecondary text-secondaryBg font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-8 text-base shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-textSecondary">
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('login')}
                className="font-bold text-accent hover:text-accentSecondary transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
