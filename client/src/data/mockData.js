export const mockContracts = [
  {
    id: "nda-102",
    fileName: "Mutual_NDA_Standard_v4.pdf",
    fileSize: "142 KB",
    uploadTime: "Just now",
    contractType: "Mutual Non-Disclosure Agreement",
    partiesInvolved: "Aether AI Inc. & Zenith Enterprises LLC",
    effectiveDate: "2026-08-01",
    expirationDate: "2029-08-01 (3 Year Term)",
    paymentTerms: "N/A (No financial transactions defined)",
    terminationClause: "30 days prior written notice by either party. Survival period for confidentiality obligation is 5 years post-termination.",
    confidentiality: "Mutual obligation. Applies to all written, oral, and electronic data marked proprietary.",
    jurisdiction: "State of Delaware, United States",
    renewal: "Automatic annual renewals unless terminated with 30 days notice.",
    governingLaw: "Delaware Corporate Law",
    contractHealth: "Healthy",
    executiveSummary: "A well-balanced, standard mutual non-disclosure agreement. It protects proprietary technical information and business secrets for both parties. Obligations are reciprocal, and the 5-year survival term is standard. The only notable point is the automatic renewal, which should be monitored to prevent unintended extension.",
    riskScore: 92,
    riskLevel: "Low",
    statistics: {
      lowRisks: 7,
      mediumRisks: 1,
      highRisks: 0,
      criticalClauses: 0
    },
    timeline: [
      { date: "01 Aug 2026", label: "Contract Start", description: "Effective Date of the Mutual NDA." },
      { date: "02 Jul 2029", label: "Renewal Notice Deadline", description: "Last day to notify non-renewal (30 days before expiration)." },
      { date: "01 Aug 2029", label: "Contract Expiration", description: "End of the initial 3-year term." }
    ],
    obligations: [
      { id: "o1", obligation: "Protect Confidential Information", party: "Both Parties", deadline: "Ongoing", frequency: "Continuous", status: "Active" },
      { id: "o2", obligation: "Return or Destroy Materials", party: "Receiving Party", deadline: "30 days post-termination", frequency: "Once", status: "Upcoming" },
      { id: "o3", obligation: "Written Non-Renewal Notification", party: "Either Party", deadline: "30 Nov 2026", frequency: "Once", status: "Upcoming" }
    ],
    clauses: [
      {
        id: "c1",
        title: "Payment Clause",
        section: "Section 3.1",
        riskLevel: "Low",
        riskScore: 10,
        category: "FINANCIAL",
        description: "No payment obligations are defined in this mutual NDA. Standard reciprocal fee exclusions apply.",
        whyRisky: "No financial exchange is intended. The risk is extremely low as there are no fees or billing definitions.",
        potentialImpact: "None anticipated under typical commercial transactions.",
        recommendedAction: "No amendment necessary. Confirm that no commercial transactions are accidentally referenced."
      },
      {
        id: "c2",
        title: "Termination Clause",
        section: "Section 4.2",
        riskLevel: "Low",
        riskScore: 15,
        category: "TERMINATION",
        description: "Terminates upon 30 days written notice. Confidentiality survival period is capped at 5 years, which is highly reasonable.",
        whyRisky: "Standard reciprocal clause. Allows termination on short notice but preserves security requirements.",
        potentialImpact: "Smooth operational transition, minimal legal exposure.",
        recommendedAction: "Standard clause. No action needed."
      },
      {
        id: "c3",
        title: "Liability Clause",
        section: "Section 6.1",
        riskLevel: "Low",
        riskScore: 12,
        category: "LEGAL",
        description: "Liability is limited to direct proven damages, excluding speculative or consequential damages for both parties.",
        whyRisky: "Broad exclusion of indirect/consequential damages protects both parties from unforeseen lawsuit payouts.",
        potentialImpact: "Caps max exposure to actual direct losses.",
        recommendedAction: "Acceptable as written."
      },
      {
        id: "c4",
        title: "Confidentiality",
        section: "Section 1.1",
        riskLevel: "Low",
        riskScore: 8,
        category: "CONFIDENTIALITY",
        description: "Reciprocal obligations protecting both parties' proprietary tech stacks, source codes, and private user listings.",
        whyRisky: "Strong reciprocal confidentiality protections protect intellectual property.",
        potentialImpact: "Low risk of information leakage, robust trade secret protection.",
        recommendedAction: "Verify definition of Confidential Information covers all proprietary data forms."
      },
      {
        id: "c5",
        title: "Force Majeure",
        section: "Section 8.1",
        riskLevel: "Low",
        riskScore: 14,
        category: "OPERATIONAL",
        description: "Standard exclusions for acts of God, strikes, and global server outages. Both parties are excused from timelines during such events.",
        whyRisky: "Protects operational stability by excusing performance delays caused by uncontrollable events.",
        potentialImpact: "Prevents default claims during unforeseen global/local crises.",
        recommendedAction: "Ensure standard list of events is inclusive of cloud service failures."
      },
      {
        id: "c6",
        title: "Indemnification",
        section: "Section 7.3",
        riskLevel: "Low",
        riskScore: 5,
        category: "LEGAL",
        description: "No indemnity covenants are placed on either party. Keeps litigation risk minimal for both entities.",
        whyRisky: "Avoiding indemnities in a basic NDA prevents early allocation of high liability risks.",
        potentialImpact: "Each party covers their own legal defense costs.",
        recommendedAction: "Maintain this exclusion to keep risk minimal."
      },
      {
        id: "c7",
        title: "Data Privacy",
        section: "Section 5.2",
        riskLevel: "Low",
        riskScore: 18,
        category: "COMPLIANCE",
        description: "Compliance with GDPR and CCPA is maintained for shared developer credentials and integration parameters.",
        whyRisky: "Complies with standard privacy mandates but lacks specific operational procedures for breach responses.",
        potentialImpact: "Standard regulatory compliance is met.",
        recommendedAction: "No action required unless sensitive customer PII is shared."
      },
      {
        id: "c8",
        title: "Jurisdiction",
        section: "Section 9.2",
        riskLevel: "Medium",
        riskScore: 45,
        category: "LEGAL",
        description: "Delaware Corporate courts are selected. Highly predictable judicial environment, though out-of-state for Zenith LLC.",
        whyRisky: "Delaware is out of state for Zenith Enterprises LLC. Zenith may face increased travel and administrative costs for litigation.",
        potentialImpact: "Higher defense costs if a dispute arises, though Delaware courts are highly expert in business matters.",
        recommendedAction: "Ensure litigation budgets account for out-of-state venue selection."
      }
    ],
    chartData: [
      { name: "Payment", score: 100 },
      { name: "Termination", score: 90 },
      { name: "Liability", score: 95 },
      { name: "Confidentiality", score: 98 },
      { name: "Force Majeure", score: 92 },
      { name: "Indemnity", score: 100 },
      { name: "Privacy", score: 90 },
      { name: "Jurisdiction", score: 75 }
    ]
  },
  {
    id: "saas-204",
    fileName: "Enterprise_SaaS_Service_Agreement.docx",
    fileSize: "845 KB",
    uploadTime: "Just now",
    contractType: "SaaS Enterprise Terms of Service",
    partiesInvolved: "CloudSphere Technologies Inc. & FortuneRetail Corp",
    effectiveDate: "2026-09-15",
    expirationDate: "2028-09-15 (2 Year Term)",
    paymentTerms: "Net 45 days. 1.5% monthly late fee applies to overdue amounts.",
    terminationClause: "For cause with 30-day cure period. Customer may terminate for convenience with a 90-day written notice and a 20% cancellation fee.",
    confidentiality: "Unilateral/Mutual. Robust protection of customer data, but intellectual property of the SaaS platform remains solely with the provider.",
    jurisdiction: "San Francisco County, California",
    renewal: "No automatic renewal. Must execute a new Order Form.",
    governingLaw: "California State Law",
    contractHealth: "Medium Risk",
    executiveSummary: "A standard enterprise SaaS agreement but with several terms heavily favoring the vendor. Specifically, the late payment fee is high (1.5%/month), the convenience termination carries a 20% early cancellation fee, and the limitation of liability is highly protective of the vendor. Data privacy compliance needs closer review.",
    riskScore: 68,
    riskLevel: "Medium",
    statistics: {
      lowRisks: 3,
      mediumRisks: 3,
      highRisks: 2,
      criticalClauses: 1
    },
    timeline: [
      { date: "15 Sep 2026", label: "Contract Start", description: "Effective Date of the SaaS Subscription." },
      { date: "17 Jun 2028", label: "Notice Period Deadline", description: "90-day written notice limit if seeking to end contract early without default." },
      { date: "15 Sep 2028", label: "Contract Expiration", description: "End of SaaS subscription term." }
    ],
    obligations: [
      { id: "saas-o1", obligation: "Pay Service Invoices", party: "FortuneRetail Corp", deadline: "Net 45 of invoice date", frequency: "Monthly", status: "Active" },
      { id: "saas-o2", obligation: "SOC2 Compliance Audits", party: "CloudSphere Technologies Inc.", deadline: "Annual", frequency: "Yearly", status: "Active" },
      { id: "saas-o3", obligation: "90-day Termination Notice", party: "FortuneRetail Corp", deadline: "17 Jun 2028", frequency: "Once", status: "Upcoming" }
    ],
    clauses: [
      {
        id: "saas-c1",
        title: "Payment Clause",
        section: "Section 3.2",
        riskLevel: "Medium",
        riskScore: 55,
        category: "FINANCIAL",
        description: "Net 45 payment terms are standard, but the 1.5% monthly compound penalty (18% annually) on late invoices is high.",
        whyRisky: "Overdue payments quickly accumulate interest penalties, adding substantial financial liability for billing disputes.",
        potentialImpact: "Increased financial expenses and operational friction if invoices are delayed.",
        recommendedAction: "Negotiate late fee down to 0.5% per month or cap the total potential late fee accumulation at 5% of the invoice."
      },
      {
        id: "saas-c2",
        title: "Termination Clause",
        section: "Section 7.4",
        riskLevel: "High",
        riskScore: 80,
        category: "TERMINATION",
        description: "Convenience termination by the buyer triggers a 20% penalty fee of the remaining contract value. Highly unfavorable.",
        whyRisky: "If the SaaS service performs poorly or is no longer needed, terminating early triggers a severe cash penalty.",
        potentialImpact: "Vendor lock-in and significant financial penalty for migrating services early.",
        recommendedAction: "Negotiate to remove the 20% early cancellation fee, substituting it with a simple notice period (e.g. 60 days) without monetary penalties."
      },
      {
        id: "saas-c3",
        title: "Liability Clause",
        section: "Section 8.1",
        riskLevel: "High",
        riskScore: 85,
        category: "LEGAL",
        description: "Caps vendor's overall liability to 6 months of service fees. This does not offer sufficient protection for data breach liability.",
        whyRisky: "A major security breach could cost millions in damages, but vendor's exposure is capped at a few thousand dollars.",
        potentialImpact: "FortuneRetail Corp must absorb the majority of costs related to cyber breaches or service downtime.",
        recommendedAction: "Insist on a super-cap or carve-out for data breaches, confidentiality violations, and gross negligence, raising the limit to at least $1,000,000."
      },
      {
        id: "saas-c4",
        title: "Confidentiality",
        section: "Section 4.1",
        riskLevel: "Low",
        riskScore: 20,
        category: "CONFIDENTIALITY",
        description: "Standard protections are in place for intellectual property, credentials, and business statistics.",
        whyRisky: "Standard terms protect vendor proprietary systems, while customer data is protected through basic clauses.",
        potentialImpact: "Basic intellectual property safety is guaranteed.",
        recommendedAction: "Verify that customer data is defined clearly and explicitly protected from third-party resale."
      },
      {
        id: "saas-c5",
        title: "Force Majeure",
        section: "Section 9.1",
        riskLevel: "Low",
        riskScore: 10,
        category: "OPERATIONAL",
        description: "Vague clause but standard; excuses services during cloud server host failures and telecommunication blockades.",
        whyRisky: "Vendor is not penalized for outages outside their direct control (e.g., AWS/Azure downtime).",
        potentialImpact: "No service availability claims can be made if major hosting providers fail.",
        recommendedAction: "Link SLA credits directly to hosting reliability regardless of cloud partner defaults."
      },
      {
        id: "saas-c6",
        title: "Indemnification",
        section: "Section 6.2",
        riskLevel: "Medium",
        riskScore: 50,
        category: "LEGAL",
        description: "Vendor indemnifies customer for IP infringements, but customer must indemnify vendor for all content uploaded.",
        whyRisky: "Reciprocal indemnities can expose the customer to lawsuits from third parties if uploaded user files infringe copyrights.",
        potentialImpact: "Possible litigation costs related to user-uploaded digital media.",
        recommendedAction: "Cap customer liability for third-party uploads unless there is explicit bad-faith infringement."
      },
      {
        id: "saas-c7",
        title: "Data Privacy",
        section: "Section 6.3",
        riskLevel: "Medium",
        riskScore: 60,
        category: "COMPLIANCE",
        description: "Mentions SOC2 compliance but lacks clear wording regarding notification speed for active security breaches.",
        whyRisky: "Regulatory mandates (GDPR/CCPA) require rapid notification of data breaches. Missing breach notification timelines is risky.",
        potentialImpact: "Risk of regulatory compliance fines and loss of consumer trust.",
        recommendedAction: "Add an explicit amendment requiring the vendor to notify the customer within 72 hours of any security breach discovery."
      },
      {
        id: "saas-c8",
        title: "Jurisdiction",
        section: "Section 9.5",
        riskLevel: "Low",
        riskScore: 15,
        category: "LEGAL",
        description: "California courts specified. Reliable judicial environment for technology, licensing, and cloud service disputes.",
        whyRisky: "Standard jurisdiction choice. California courts are well-versed in SaaS and cloud technology issues.",
        potentialImpact: "Predictable legal resolutions.",
        recommendedAction: "No action required. Acceptable venue choice."
      }
    ],
    chartData: [
      { name: "Payment", score: 65 },
      { name: "Termination", score: 40 },
      { name: "Liability", score: 30 },
      { name: "Confidentiality", score: 85 },
      { name: "Force Majeure", score: 90 },
      { name: "Indemnity", score: 70 },
      { name: "Privacy", score: 60 },
      { name: "Jurisdiction", score: 95 }
    ]
  },
  {
    id: "employment-301",
    fileName: "Executive_Employment_Agreement_Final.pdf",
    fileSize: "1.2 MB",
    uploadTime: "Just now",
    contractType: "Executive Employment Agreement",
    partiesInvolved: "Apex Logistics Corp & Sarah Jenkins (VP of Engineering)",
    effectiveDate: "2026-10-01",
    expirationDate: "Indefinite / At-Will",
    paymentTerms: "Base salary $245,000/yr paid bi-weekly, plus up to 40% performance bonus.",
    terminationClause: "At-will termination. 6 months severance if terminated without cause. Immediate termination for Cause (defined strictly).",
    confidentiality: "Strict proprietary information, intellectual property assignment, and 12-month post-employment non-compete.",
    jurisdiction: "New York County, New York",
    renewal: "N/A (At-will, ongoing employment)",
    governingLaw: "New York State Labor Law",
    contractHealth: "High Risk",
    executiveSummary: "This executive contract offers competitive compensation and a strong severance package. However, it contains severe post-employment restrictions, including a 12-month non-compete that applies nationwide, and a broad definition of intellectual property assignment that covers any inventions made during the term of employment.",
    riskScore: 48,
    riskLevel: "High",
    statistics: {
      lowRisks: 1,
      mediumRisks: 3,
      highRisks: 4,
      criticalClauses: 3
    },
    timeline: [
      { date: "01 Oct 2026", label: "Employment Start", description: "Sarah Jenkins begins employment as VP of Engineering." },
      { date: "Ongoing", label: "Performance Reviews", description: "Evaluated annually for 40% performance bonus eligibility." }
    ],
    obligations: [
      { id: "emp-o1", obligation: "Perform Engineering Leadership Duties", party: "Sarah Jenkins", deadline: "Continuous", frequency: "Continuous", status: "Active" },
      { id: "emp-o2", obligation: "Disburse Salary Payments", party: "Apex Logistics Corp", deadline: "Bi-Weekly", frequency: "Bi-weekly", status: "Active" },
      { id: "emp-o3", obligation: "Nationwide Non-Compete", party: "Sarah Jenkins", deadline: "12 months post-employment", frequency: "Continuous", status: "Active" }
    ],
    clauses: [
      {
        id: "emp-c1",
        title: "Payment Clause",
        section: "Section 2.1",
        riskLevel: "Low",
        riskScore: 10,
        category: "FINANCIAL",
        description: "Excellent base salary ($245k) with clear bi-weekly disbursement, and performance bonuses clearly benchmarked.",
        whyRisky: "Extremely standard terms with high precision compensation layout.",
        potentialImpact: "Positive compensation guarantee, clear incentive frameworks.",
        recommendedAction: "No action required. Acceptable salary terms."
      },
      {
        id: "emp-c2",
        title: "Termination Clause",
        section: "Section 5.2",
        riskLevel: "Medium",
        riskScore: 40,
        category: "TERMINATION",
        description: "Employment is at-will, meaning termination can happen anytime, though balanced by a 6-month severance package.",
        whyRisky: "At-will clause allows immediate firing. However, the 6-month severance acts as a financial buffer.",
        potentialImpact: "Potential sudden job loss offset by severance check.",
        recommendedAction: "Ensure 'Cause' definitions are strictly limited so the employer cannot avoid paying severance using weak excuses."
      },
      {
        id: "emp-c3",
        title: "Liability Clause",
        section: "Section 8.3",
        riskLevel: "High",
        riskScore: 78,
        category: "LEGAL",
        description: "Lacks clear corporate officer D&O insurance backing. Executive could be personally liable for operations.",
        whyRisky: "Without D&O insurance backing, legal decisions made as VP could lead to personal liability lawsuits.",
        potentialImpact: "Personal asset vulnerability to external legal claims.",
        recommendedAction: "Add an explicit covenant forcing the company to maintain D&O insurance covering the executive up to $2M."
      },
      {
        id: "emp-c4",
        title: "Confidentiality",
        section: "Section 6.1",
        riskLevel: "High",
        riskScore: 82,
        category: "CONFIDENTIALITY",
        description: "Extremely broad definition. Prohibits sharing any 'know-how' developed during employment, extending indefinitely.",
        whyRisky: "Indefinite know-how ban makes it legally difficult to work at future engineering companies in the same sector.",
        potentialImpact: "Long-term restrictions on career mobility and software development practices.",
        recommendedAction: "Limit 'Confidential Information' to written/marked materials and cap the survival term at 2-3 years post-termination."
      },
      {
        id: "emp-c5",
        title: "Force Majeure",
        section: "Section 9.1",
        riskLevel: "Medium",
        riskScore: 50,
        category: "OPERATIONAL",
        description: "Vague definitions. Excuses company from compensation obligations during local economic disruptions or emergencies.",
        whyRisky: "The company could stop paying base salary during economic downturns under the guise of an emergency.",
        potentialImpact: "Temporary salary delays or losses without breach of contract.",
        recommendedAction: "Carve out basic payment obligations from the force majeure clause to ensure salary is paid."
      },
      {
        id: "emp-c6",
        title: "Indemnification",
        section: "Section 8.2",
        riskLevel: "Medium",
        riskScore: 60,
        category: "LEGAL",
        description: "Indemnification for legal expenses is conditional on company's board approval, posing potential risks for the executive.",
        whyRisky: "If the executive falls out with the board, the board could withhold litigation expense approval.",
        potentialImpact: "High out-of-pocket costs to defend corporate actions in court.",
        recommendedAction: "Modify terms to make indemnification mandatory for all actions performed within ordinary duties."
      },
      {
        id: "emp-c7",
        title: "Data Privacy",
        section: "Section 7.1",
        riskLevel: "High",
        riskScore: 75,
        category: "COMPLIANCE",
        description: "Broad clause assigning all rights to private inventions, code snippets, and research created on personal hours.",
        whyRisky: "The employer owns everything created, even outside of company hours/resources. Restricts personal side projects.",
        potentialImpact: "Loss of personal side project IP rights.",
        recommendedAction: "Exclude inventions created on personal time, using personal equipment, that do not relate to company business."
      },
      {
        id: "emp-c8",
        title: "Jurisdiction",
        section: "Section 11.2",
        riskLevel: "High",
        riskScore: 88,
        category: "LEGAL",
        description: "New York courts selected. Strong employer protections apply; arbitration clauses prevent seeking jury trials.",
        whyRisky: "Forced arbitration and New York venue prevent the employee from seeking jury resolutions for employment disputes.",
        potentialImpact: "Lower statistical likelihood of winning wrongful termination disputes through private arbitration.",
        recommendedAction: "Request California venue if employee resides there, or preserve the right to a public court trial."
      }
    ],
    chartData: [
      { name: "Payment", score: 90 },
      { name: "Termination", score: 75 },
      { name: "Liability", score: 40 },
      { name: "Confidentiality", score: 35 },
      { name: "Force Majeure", score: 60 },
      { name: "Indemnity", score: 55 },
      { name: "Privacy", score: 30 },
      { name: "Jurisdiction", score: 25 }
    ]
  }
];
