import React from 'react';
import { Brain, Heart, Github, Linkedin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondaryBg border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-8 mb-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-xl text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-textPrimary tracking-tight">
                Contract Review Assist
              </span>
              <p className="text-[11px] text-textMuted font-semibold tracking-wider uppercase mt-0.5">
                AI Powered Legal Compliance Assistant
              </p>
            </div>
          </div>

          {/* Project Details */}
          <div className="text-center md:text-right max-w-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-card text-accent border border-border">
              Enterprise Compliance
            </span>
            <p className="text-xs text-textMuted mt-2">
              Audited and verified against standard SOC2, GDPR, and ISO 27001 regulatory guidelines.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-textMuted uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <span>© 2026 LegalTech Labs. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for enterprise contract reviews.</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-primary transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Security & Privacy
            </a>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              Github Reference
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
