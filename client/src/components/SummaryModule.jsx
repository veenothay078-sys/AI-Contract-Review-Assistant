import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Users, Calendar, Clock, DollarSign, Ban, 
  Lock, MapPin, RefreshCw, Scale, ShieldAlert, Sparkles, Heart,
  Edit3, Check, X, Copy
} from 'lucide-react';

export default function SummaryModule({ contract, onShowNotification }) {
  if (!contract) return null;

  const {
    contractType,
    partiesInvolved,
    effectiveDate,
    expirationDate,
    paymentTerms,
    terminationClause,
    confidentiality,
    jurisdiction,
    renewal,
    governingLaw,
    contractHealth,
    executiveSummary
  } = contract;

  // State to hold field values for interactive inline edits
  const [editedData, setEditedData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Initialize values when contract changes
  useEffect(() => {
    setEditedData({
      "Contract Type": contractType,
      "Parties Involved": partiesInvolved,
      "Effective Date": effectiveDate,
      "Expiration Date": expirationDate,
      "Payment Terms": paymentTerms,
      "Termination Clause": terminationClause,
      "Confidentiality": confidentiality,
      "Jurisdiction": jurisdiction,
      "Renewal": renewal,
      "Governing Law": governingLaw,
    });
    setEditingField(null);
  }, [contract]);

  const getHealthBadge = (health) => {
    switch (health) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-success/20 text-success border border-success/30">
            <Heart className="w-4 h-4 fill-success text-success" />
            <span>Healthy</span>
          </span>
        );
      case 'Medium Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-warning/20 text-warning border border-warning/30">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span>Medium Risk</span>
          </span>
        );
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-danger/20 text-danger border border-danger/30">
            <ShieldAlert className="w-4 h-4 text-danger animate-bounce" />
            <span>High Risk</span>
          </span>
        );
      default:
        return null;
    }
  };

  const fields = [
    { label: "Contract Type", icon: FileText, color: "text-accent bg-elevated" },
    { label: "Parties Involved", icon: Users, color: "text-accentSecondary bg-elevated" },
    { label: "Effective Date", icon: Calendar, color: "text-success bg-elevated" },
    { label: "Expiration Date", icon: Clock, color: "text-danger bg-elevated" },
    { label: "Payment Terms", icon: DollarSign, color: "text-warning bg-elevated" },
    { label: "Termination Clause", icon: Ban, color: "text-textMuted bg-elevated" },
    { label: "Confidentiality", icon: Lock, color: "text-accent bg-elevated" },
    { label: "Jurisdiction", icon: MapPin, color: "text-accentSecondary bg-elevated" },
    { label: "Renewal", icon: RefreshCw, color: "text-success bg-elevated" },
    { label: "Governing Law", icon: Scale, color: "text-accentSecondary bg-elevated" },
  ];

  const handleEditClick = (label, currentVal) => {
    setEditingField(label);
    setTempValue(currentVal);
  };

  const handleSaveClick = (label) => {
    setEditedData(prev => ({
      ...prev,
      [label]: tempValue
    }));
    setEditingField(null);
    if (onShowNotification) {
      onShowNotification(`Updated "${label}" successfully.`);
    }
  };

  const handleCopyClick = (label, val) => {
    navigator.clipboard.writeText(val);
    if (onShowNotification) {
      onShowNotification(`Copied value of "${label}" to clipboard!`);
    }
  };

  return (
    <div id="summary-module" className="px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
      >
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent border border-accent/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textPrimary">Contract Overview</h2>
              <p className="text-xs text-textMuted mt-0.5">Extracted terms and metadata (Editable)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border border-border">
            <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Status:</span>
            {getHealthBadge(contractHealth)}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Key Fields Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f, idx) => {
              const IconComponent = f.icon;
              const displayVal = editedData[f.label] || "";
              const isEditing = editingField === f.label;

              return (
                <div 
                  key={idx} 
                  className="p-3 bg-background hover:bg-elevated rounded-lg border border-border/50 hover:border-border transition-all duration-200 flex items-start gap-3 group relative min-h-[80px]"
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${f.color} group-hover:scale-105 border border-border/50`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-8">
                    <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block mb-0.5">
                      {f.label}
                    </span>
                    
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="w-full text-xs font-semibold text-textPrimary bg-card border border-border rounded px-2 py-1 focus:outline-none focus:border-accent"
                        />
                        <button 
                          onClick={() => handleSaveClick(f.label)}
                          className="p-1 bg-success hover:bg-success/80 text-background rounded transition-colors"
                          title="Save"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setEditingField(null)}
                          className="p-1 bg-danger hover:bg-danger/80 text-background rounded transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-textPrimary block break-words leading-tight">
                        {displayVal}
                      </span>
                    )}
                  </div>

                  {/* Actions (Edit / Copy) Overlay */}
                  {!isEditing && (
                    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-card border border-border rounded-md shadow-sm p-0.5">
                      <button
                        onClick={() => handleCopyClick(f.label, displayVal)}
                        className="p-1 hover:bg-elevated rounded text-textMuted hover:text-textPrimary transition-colors"
                        title="Copy Value"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEditClick(f.label, displayVal)}
                        className="p-1 hover:bg-elevated rounded text-textMuted hover:text-textPrimary transition-colors"
                        title="Edit Field"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Executive Summary panel */}
          <div className="flex flex-col h-full p-5 bg-background border border-border/50 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-textPrimary text-base">Executive Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">
                {executiveSummary}
              </p>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">
                  Automated Legal Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
