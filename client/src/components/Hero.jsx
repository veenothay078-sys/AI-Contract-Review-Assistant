import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, BarChart3, Clock, AlertTriangle } from 'lucide-react';

export default function Hero({ onScrollToUpload }) {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-secondaryBg via-background to-transparent">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-semibold mb-6 sm:mb-8 hover:bg-accent/15 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span>Next-Generation Legal Intelligence</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-textPrimary max-w-4xl mx-auto leading-[1.15]"
        >
          AI Contract <span className="bg-gradient-to-r from-accent via-accentSecondary to-accent bg-clip-text text-transparent">Review Assist</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-textMuted max-w-2xl mx-auto leading-relaxed"
        >
          Upload contracts and instantly analyze clauses, generate summaries, and identify legal risks using AI.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onScrollToUpload}
            className="px-8 py-4 bg-accent text-secondaryBg font-semibold rounded-premium shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:bg-accentSecondary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-base"
          >
            <span>Analyze a Contract</span>
            <Shield className="w-4 h-4" />
          </button>
          
          <a
            href="#dashboard-view"
            className="px-8 py-4 bg-card hover:bg-elevated text-textSecondary font-semibold rounded-premium border border-border shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-base"
          >
            <span>View Dashboard Demo</span>
            <BarChart3 className="w-4 h-4 text-textMuted" />
          </a>
        </motion.div>

        {/* Quick Highlights / Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 sm:mt-20 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 bg-card/50 backdrop-blur-sm p-6 sm:p-8 rounded-premium border border-border shadow-premium"
        >
          <div className="flex flex-col items-center">
            <div className="p-3 bg-elevated text-accent rounded-2xl mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">&lt; 3 Seconds</span>
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider mt-1">Analysis Time</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 bg-elevated text-success rounded-2xl mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">10+ Metrics</span>
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider mt-1">Clause Scope</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 bg-elevated text-warning rounded-2xl mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">Precision Risk</span>
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider mt-1">Classification</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-3 bg-elevated text-accentSecondary rounded-2xl mb-3">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-textPrimary">Interactive</span>
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider mt-1">Recharts Visuals</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
