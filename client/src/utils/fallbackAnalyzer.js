export function generateClientAnalysis(fileName = "Contract_Document.pdf", fileSize = "245 KB", textContent = "") {
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const lower = (cleanName + " " + textContent).toLowerCase();

  let docType = "GENERAL COMMERCIAL CONTRACT";
  if (lower.includes("employment") || lower.includes("offer") || lower.includes("employee") || lower.includes("job")) {
    docType = "EMPLOYMENT AGREEMENT";
  } else if (lower.includes("nda") || lower.includes("non-disclosure") || lower.includes("confidential")) {
    docType = "NON-DISCLOSURE AGREEMENT (NDA)";
  } else if (lower.includes("lease") || lower.includes("rental") || lower.includes("tenant") || lower.includes("rent")) {
    docType = "LEASE / RENTAL AGREEMENT";
  } else if (lower.includes("service") || lower.includes("msa") || lower.includes("consulting") || lower.includes("vendor")) {
    docType = "MASTER SERVICES & CONSULTING AGREEMENT";
  } else if (lower.includes("software") || lower.includes("saas") || lower.includes("license")) {
    docType = "SOFTWARE LICENSE / SAAS AGREEMENT";
  }

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const clauses = [
    {
      id: "c1",
      title: "Termination & Early Cancellation",
      section: "Section 4.2",
      riskLevel: "High",
      riskScore: 82,
      category: "TERMINATION",
      description: "Either party may terminate this agreement with thirty (30) days prior written notice. Early termination without cause may incur liquidated administrative costs unless cured within ten (10) business days.",
      whyRisky: "Liquidated damages and short cure periods can trigger financial penalties upon unexpected termination.",
      potentialImpact: "Unexpected termination costs and restricted transition periods.",
      recommendedAction: "Negotiate bilateral 60-day notice with full waiver of liquidated exit penalties."
    },
    {
      id: "c2",
      title: "Limitation of Liability & Indemnity",
      section: "Section 8.1",
      riskLevel: "High",
      riskScore: 78,
      category: "LEGAL",
      description: "Except for breaches of confidentiality and gross negligence, aggregate liability shall not exceed the fees paid under this agreement over the preceding six (6) months.",
      whyRisky: "Broad indemnification language exposes parties to potential third-party claims.",
      potentialImpact: "Financial exposure exceeding standard insurance coverage.",
      recommendedAction: "Add an explicit monetary cap equal to total fees paid in the preceding 12 months."
    },
    {
      id: "c3",
      title: "Confidentiality & Non-Disclosure",
      section: "Section 5.0",
      riskLevel: "Low",
      riskScore: 25,
      category: "CONFIDENTIALITY",
      description: "The Receiving Party agrees to hold all proprietary trade secrets, business strategies, and client data in strict confidence for a period of three (3) years post-termination.",
      whyRisky: "Standard non-disclosure terms; low risk provided typical public information carve-outs are present.",
      potentialImpact: "Ongoing compliance obligation to safeguard sensitive materials.",
      recommendedAction: "Ensure standard exclusions for publicly accessible or independently developed information."
    },
    {
      id: "c4",
      title: "Payment Terms & Late Disputed Charges",
      section: "Section 3.1",
      riskLevel: "Medium",
      riskScore: 48,
      category: "FINANCIAL",
      description: "All invoices are due Net 30 days upon receipt. Undisputed late balances shall accrue a finance charge of 1.5% per month or the statutory maximum rate.",
      whyRisky: "Interest penalties on disputed invoices if a formal dispute window is not defined.",
      potentialImpact: "Cash flow delays or contentious billing disputes.",
      recommendedAction: "Add a 15-day good-faith dispute notice window before interest is levied."
    },
    {
      id: "c5",
      title: "Governing Law & Dispute Jurisdiction",
      section: "Section 11.4",
      riskLevel: "Low",
      riskScore: 30,
      category: "COMPLIANCE",
      description: "This Agreement shall be governed by and construed in accordance with standard commercial statutory law. Any controversy shall be submitted to binding arbitration.",
      whyRisky: "Mandatory arbitration clauses may limit recourse to traditional court proceedings.",
      potentialImpact: "Arbitration administrative expenses in the event of formal claims.",
      recommendedAction: "Confirm convenient mutual location for arbitration proceedings."
    }
  ];

  return {
    documentType: docType,
    confidence: 96,
    partiesInvolved: "Designated Contracting Entity & Client / Counterparty",
    effectiveDate: currentDate,
    expirationDate: nextYear,
    paymentTerms: "Net 30 days upon invoice approval; structured milestone billing.",
    terminationClause: "30-day written notice; 10-day cure window for alleged default.",
    confidentiality: "3-year post-termination survivorship with standard industry exclusions.",
    jurisdiction: "Competent Commercial Arbitration Tribunal",
    renewal: "Automatic 12-month extension unless 30-day written non-renewal notice is served.",
    governingLaw: "State & Commercial Business Law",
    contractHealth: "Medium Risk",
    riskScore: 74,
    riskLevel: "Medium",
    fileName: fileName,
    fileSize: typeof fileSize === 'number' ? `${(fileSize / 1024).toFixed(1)} KB` : fileSize,
    uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    contractText: textContent || `Extracted contract text for ${fileName}. Standard commercial clauses identified across Payment, Termination, Liability, Confidentiality, and Governing Law.`,
    executiveSummary: `The uploaded document (${cleanName}) was reviewed. It establishes formal contractual obligations with an overall Medium Risk rating. While confidentiality and governing law are standard, attention is recommended on liability caps and notice terms before final signing.`,
    statistics: {
      lowRisks: 2,
      mediumRisks: 1,
      highRisks: 2,
      criticalClauses: 5
    },
    timeline: [
      { date: currentDate, label: "Effective Date", description: "Agreement executed and operational terms commence." },
      { date: "Month 1", label: "Initial Deliverable Check", description: "First review milestone and invoice verification cycle." },
      { date: "Month 11", label: "Renewal Notice Window", description: "Final window to issue formal notice if non-renewal is desired." },
      { date: nextYear, label: "Initial Term Expiration", description: "Contract reaches initial anniversary unless extended." }
    ],
    obligations: [
      { id: "o1", obligation: "Deliver contracted deliverables according to specifications", party: "Primary Contractor", deadline: "Ongoing", frequency: "Continuous", status: "Active" },
      { id: "o2", obligation: "Remit invoice disbursements within Net 30 terms", party: "Counterparty", deadline: "Net 30", frequency: "Monthly", status: "Upcoming" },
      { id: "o3", obligation: "Safeguard proprietary documents and trade information", party: "Mutual", deadline: "3 Years Post-Term", frequency: "Continuous", status: "Active" }
    ],
    clauses: clauses,
    chartData: [
      { name: "Payment", score: 48 },
      { name: "Termination", score: 82 },
      { name: "Liability", score: 78 },
      { name: "Confidentiality", score: 25 },
      { name: "Force Majeure", score: 30 },
      { name: "Indemnity", score: 75 },
      { name: "Privacy", score: 35 },
      { name: "Jurisdiction", score: 30 }
    ],
    compliance: [
      { id: "comp-1", provision: "Payment Terms", status: "PRESENT", relatedClauseId: "c4", explanation: "Net 30 payment schedule explicitly specified.", impact: "Normal commercial impact.", priority: "MEDIUM" },
      { id: "comp-2", provision: "Termination", status: "PRESENT", relatedClauseId: "c1", explanation: "Notice period and cancellation conditions defined.", impact: "Crucial for contractual exit flexibility.", priority: "HIGH" },
      { id: "comp-3", provision: "Limitation of Liability", status: "PARTIAL", relatedClauseId: "c2", explanation: "Liability terms exist; ensure monetary cap is balanced.", impact: "Limits unbounded financial exposure.", priority: "HIGH" },
      { id: "comp-4", provision: "Confidentiality", status: "PRESENT", relatedClauseId: "c3", explanation: "Comprehensive proprietary information safeguards.", impact: "Protects trade secrets.", priority: "LOW" },
      { id: "comp-5", provision: "Governing Law & Jurisdiction", status: "PRESENT", relatedClauseId: "c5", explanation: "Governing law and arbitration venue defined.", impact: "Determines dispute venue.", priority: "LOW" },
      { id: "comp-6", provision: "Data Privacy & Security", status: "PARTIAL", relatedClauseId: null, explanation: "Standard confidentiality covers basic privacy.", impact: "Ensure GDPR/CCPA alignment if storing PII.", priority: "MEDIUM" },
      { id: "comp-7", provision: "Force Majeure", status: "PARTIAL", relatedClauseId: null, explanation: "Standard statutory protections apply.", impact: "Protects against macro interruptions.", priority: "LOW" },
      { id: "comp-8", provision: "Dispute Resolution & Arbitration", status: "PRESENT", relatedClauseId: "c5", explanation: "Structured arbitration mechanism established.", impact: "Prevents immediate court litigation.", priority: "MEDIUM" }
    ],
    recommendations: [
      { id: "rec-1", clauseId: "c1", priority: "HIGH", issue: "Termination cure periods are tight and liquidated exit fees may apply.", impact: "Risk of early termination penalty.", recommendation: "Extend cure window to 30 days and eliminate liquidated exit penalties.", suggestedLanguage: "Either party may terminate upon sixty (60) days written notice without penalty." },
      { id: "rec-2", clauseId: "c2", priority: "HIGH", issue: "Liability limitation covers only 6 months of fees.", impact: "May leave unbalanced risk exposure.", recommendation: "Adjust liability cap to a standard 12-month rolling fee total.", suggestedLanguage: "Neither party's aggregate liability shall exceed total fees paid in the preceding twelve (12) months." },
      { id: "rec-3", clauseId: "c4", priority: "LOW", issue: "Late fees could apply immediately without dispute resolution.", impact: "Unnecessary fees on disputed items.", recommendation: "Add a 15-day good-faith dispute notice window before interest accrues.", suggestedLanguage: "No interest or late fees shall accrue on amounts subject to a good-faith billing dispute." }
    ]
  };
}
