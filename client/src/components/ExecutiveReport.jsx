import React, { useRef, useState } from 'react';
import { Download, ArrowLeft, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ExecutiveReport({ contract, onBack }) {
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  if (!contract) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setMessage('Generating PDF...');
    
    try {
      const element = reportRef.current;
      const sanitizedTitle = contract.title ? contract.title.replace(/[^a-zA-Z0-9]/g, '_') : 'Contract';
      const versionNum = contract.versionNumber || 'Current';
      
      const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5],
        filename:     `Contract_Review_Report_${sanitizedTitle}_V${versionNum}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      
      setMessage('PDF report downloaded successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setMessage('Unable to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const highRisks = contract.clauses?.filter(c => c.riskLevel === 'High') || [];
  const mediumRisks = contract.clauses?.filter(c => c.riskLevel === 'Medium') || [];
  const lowRisks = contract.clauses?.filter(c => c.riskLevel === 'Low') || [];
  
  const compliantCount = contract.compliance?.filter(c => c.status === 'PRESENT').length || 0;
  const missingCount = contract.compliance?.filter(c => c.status === 'MISSING').length || 0;
  const partialCount = contract.compliance?.filter(c => c.status === 'PARTIAL').length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-textSecondary font-semibold rounded-xl text-sm transition-all hover:bg-elevated">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-sm font-semibold ${message.includes('successfully') ? 'text-success' : message.includes('Generating') ? 'text-accent animate-pulse' : 'text-danger'}`}>
              {message}
            </span>
          )}
          <button 
            onClick={handleDownloadPDF} 
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-secondaryBg font-semibold rounded-xl text-sm transition-all hover:bg-accentSecondary disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> 
            {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Printable Area - styled for PDF specifically */}
      <div className="bg-white rounded-premium shadow-sm overflow-hidden border border-border">
        <div ref={reportRef} className="bg-white text-black text-sm p-8" style={{ fontFamily: 'sans-serif', color: '#1f2937' }}>
          
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center" style={{ pageBreakInside: 'avoid' }}>
            <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-900 mb-2">Contract Review Analyst</h1>
            <h2 className="text-2xl font-bold text-gray-900">{contract.title || 'Untitled Contract'}</h2>
            <div className="flex items-center justify-center gap-6 mt-4 text-gray-600 font-semibold">
              <span>Current Version: Version {contract.versionNumber || 'Current'}</span>
              <span>•</span>
              <span>Analysis Date: {new Date(contract.uploadedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 1. CONTRACT OVERVIEW */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">1. Contract Overview</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div><strong className="text-gray-700">Contract Name:</strong> {contract.fileName || 'Not specified'}</div>
              <div><strong className="text-gray-700">Contract Type:</strong> {contract.documentType || 'Not specified'}</div>
              <div className="col-span-2"><strong className="text-gray-700">Parties:</strong> {contract.partiesInvolved || 'Not specified'}</div>
              <div><strong className="text-gray-700">Effective Date:</strong> {contract.effectiveDate || 'Not specified'}</div>
              <div><strong className="text-gray-700">Expiration Date:</strong> {contract.expirationDate || 'Not specified'}</div>
            </div>
          </div>

          {/* 2. EXECUTIVE SUMMARY */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">2. Executive Summary</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="leading-relaxed text-gray-800">
                {contract.executiveSummary || 'No executive summary provided.'}
              </p>
            </div>
          </div>

          {/* 3. OVERALL RISK ASSESSMENT */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">3. Overall Risk Assessment</h3>
            <div className="flex gap-6 mb-4">
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-sm font-bold text-gray-500 uppercase">Risk Score</p>
                <p className="text-5xl font-bold text-gray-900 mt-2">{contract.riskScore} <span className="text-xl text-gray-500">/100</span></p>
              </div>
              <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-gray-500 uppercase">Risk Level</p>
                <div className={`mt-2 flex items-center justify-center gap-2 ${contract.riskLevel === 'High' ? 'text-red-600' : contract.riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-600'}`}>
                  {contract.riskLevel === 'High' ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                  <span className="text-3xl font-bold uppercase">{contract.riskLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 font-bold">
                <span className="block text-2xl">{highRisks.length}</span> High Risk Clauses
              </div>
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-800 font-bold">
                <span className="block text-2xl">{mediumRisks.length}</span> Medium Risk Clauses
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-green-800 font-bold">
                <span className="block text-2xl">{lowRisks.length}</span> Low Risk Clauses
              </div>
            </div>
          </div>

          {/* 4. EXTRACTED CONTRACT CLAUSES */}
          <div className="mb-8" style={{ pageBreakBefore: 'always' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">4. Extracted Contract Clauses</h3>
            <div className="space-y-4">
              {contract.clauses?.map((c, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden" style={{ pageBreakInside: 'avoid' }}>
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900">{c.title}</span>
                      <span className="text-gray-500 text-xs ml-2">({c.category} - {c.section !== 'Not specified' ? c.section : 'Section not specified'})</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.riskLevel === 'High' ? 'bg-red-100 text-red-700' : c.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {c.riskLevel} Risk ({c.riskScore}/100)
                    </span>
                  </div>
                  <div className="p-4 text-sm text-gray-700 bg-white">
                    <p className="italic text-gray-600 mb-2">"{c.description}"</p>
                  </div>
                </div>
              ))}
              {(!contract.clauses || contract.clauses.length === 0) && <p className="text-gray-500">No clauses extracted.</p>}
            </div>
          </div>

          {/* 5. CLAUSE-LEVEL RISK DETAILS */}
          {highRisks.length > 0 && (
            <div className="mb-8" style={{ pageBreakBefore: 'always' }}>
              <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">5. Clause-Level Risk Details (High Risk)</h3>
              <div className="space-y-6">
                {highRisks.map((c, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="font-bold text-red-900 text-lg mb-2">{c.title}</h4>
                    <p className="mb-2"><strong className="text-red-800">Why is this risky?</strong> <span className="text-gray-800">{c.whyRisky}</span></p>
                    <p className="mb-2"><strong className="text-red-800">Potential Impact:</strong> <span className="text-gray-800">{c.potentialImpact || 'Not specified'}</span></p>
                    <p><strong className="text-red-800">Recommended Action:</strong> <span className="text-gray-800">{c.recommendedAction || 'Not specified'}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. IMPORTANT DATES & OBLIGATIONS */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">6. Important Dates & Obligations</h3>
            
            <h4 className="font-bold text-gray-800 mb-2">Key Dates</h4>
            {contract.timeline && contract.timeline.length > 0 ? (
              <table className="w-full mb-6 border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left w-1/4">Date</th>
                    <th className="border border-gray-300 p-2 text-left w-1/4">Event</th>
                    <th className="border border-gray-300 p-2 text-left w-1/2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.timeline.map((t, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="border border-gray-300 p-2 font-medium">{t.date}</td>
                      <td className="border border-gray-300 p-2 font-bold text-blue-800">{t.label}</td>
                      <td className="border border-gray-300 p-2">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-gray-500 mb-6">No important dates found.</p>}

            <h4 className="font-bold text-gray-800 mb-2">Obligations</h4>
            {contract.obligations && contract.obligations.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Obligation</th>
                    <th className="border border-gray-300 p-2 text-left">Party</th>
                    <th className="border border-gray-300 p-2 text-left">Deadline</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.obligations.map((o, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="border border-gray-300 p-2">{o.obligation}</td>
                      <td className="border border-gray-300 p-2 font-medium">{o.party}</td>
                      <td className="border border-gray-300 p-2">{o.deadline}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${o.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-gray-500">No specific obligations found.</p>}
          </div>

          {/* 7. COMPLIANCE ASSESSMENT */}
          <div className="mb-8" style={{ pageBreakBefore: 'always' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">7. Compliance Assessment</h3>
            
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded text-green-800">
                <span className="block font-bold text-xl">{compliantCount}</span> Compliant
              </div>
              <div className="flex-1 bg-orange-50 border border-orange-200 p-3 rounded text-orange-800">
                <span className="block font-bold text-xl">{partialCount}</span> Partial
              </div>
              <div className="flex-1 bg-red-50 border border-red-200 p-3 rounded text-red-800">
                <span className="block font-bold text-xl">{missingCount}</span> Missing
              </div>
            </div>

            <div className="space-y-3">
              {contract.compliance?.map((c, idx) => {
                const statusColor = c.status === 'PRESENT' ? 'text-green-700 bg-green-50 border-green-200' :
                                    c.status === 'MISSING' ? 'text-red-700 bg-red-50 border-red-200' :
                                    c.status === 'PARTIAL' ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-gray-700 bg-gray-50 border-gray-200';
                
                return (
                  <div key={idx} className={`p-3 border rounded flex items-start gap-3 ${statusColor}`} style={{ pageBreakInside: 'avoid' }}>
                    <div className="mt-0.5 font-bold uppercase w-20 flex-shrink-0 text-xs tracking-wider">{c.status}</div>
                    <div>
                      <strong className="block mb-1">{c.provision}</strong>
                      <span className="text-sm">{c.explanation}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 8. NEGOTIATION RECOMMENDATIONS */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">8. Negotiation Recommendations</h3>
            <div className="space-y-4">
              {contract.recommendations?.map((r, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg" style={{ pageBreakInside: 'avoid' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${r.priority === 'HIGH' ? 'bg-red-600' : r.priority === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {r.priority} PRIORITY
                    </span>
                    <strong className="text-gray-900">{r.issue}</strong>
                  </div>
                  <p className="text-gray-700 mb-2"><strong className="text-gray-900">Recommendation:</strong> {r.recommendation}</p>
                  {r.suggestedLanguage && r.suggestedLanguage !== 'N/A' && (
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded mt-2">
                      <strong className="block text-xs text-blue-800 uppercase mb-1">Suggested Language:</strong>
                      <p className="italic text-blue-900 text-sm">"{r.suggestedLanguage}"</p>
                    </div>
                  )}
                </div>
              )) || <p className="text-gray-500">No specific negotiation recommendations.</p>}
            </div>
          </div>

          {/* 9. CONTRACT COMPARISON */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">9. Contract Comparison</h3>
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center text-gray-500 italic">
              No comparison available. Comparison data is not included in this single-version export.
            </div>
          </div>

          {/* 10. VERSION HISTORY */}
          <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">10. Version History</h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Version</th>
                  <th className="border border-gray-300 p-2 text-left">Date</th>
                  <th className="border border-gray-300 p-2 text-left">Risk Score</th>
                  <th className="border border-gray-300 p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 p-2 font-bold">Version {contract.versionNumber || 'Current'}</td>
                  <td className="border border-gray-300 p-2">{new Date(contract.uploadedAt || Date.now()).toLocaleDateString()}</td>
                  <td className="border border-gray-300 p-2 font-bold">{contract.riskScore}</td>
                  <td className="border border-gray-300 p-2 font-bold text-blue-700">CURRENT VERSION</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 11. FINAL CONTRACT ASSESSMENT */}
          <div className="mb-4" style={{ pageBreakInside: 'avoid' }}>
            <h3 className="text-lg font-bold text-blue-900 border-b border-gray-300 pb-2 mb-4 uppercase">11. Final Contract Assessment</h3>
            <div className="bg-gray-900 text-white p-6 rounded-lg">
              <p className="text-lg mb-4 text-center font-semibold">
                This contract is assessed as <span className={`uppercase font-bold ${contract.riskLevel === 'High' ? 'text-red-400' : contract.riskLevel === 'Medium' ? 'text-orange-400' : 'text-green-400'}`}>{contract.riskLevel} RISK</span> with an overall score of {contract.riskScore}/100.
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-blue-300 border-b border-gray-700 pb-1 mb-2 uppercase">Key Risk Areas</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {highRisks.slice(0,3).map((r,i) => <li key={i}>{r.title}</li>)}
                    {highRisks.length === 0 && <li className="text-gray-400">No critical high-risk clauses detected.</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-300 border-b border-gray-700 pb-1 mb-2 uppercase">Top Recommendations</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {contract.recommendations?.slice(0,3).map((r,i) => <li key={i}>{r.issue}</li>)}
                    {(!contract.recommendations || contract.recommendations.length === 0) && <li className="text-gray-400">No recommendations.</li>}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
              Generated by AI Contract Review Analyst • {new Date().toLocaleString()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
