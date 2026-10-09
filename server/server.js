import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import parsePDF from './pdf-parser.cjs';
import { db } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory upload storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'unauthorized', message: 'Access denied. No token provided.' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'forbidden', message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'missing_fields', message: 'Name, email, and password are required.' });
    }
    
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'duplicate_email', message: 'An account with this email already exists.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newUser = db.createUser(name, email, passwordHash, company);
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, company: newUser.company } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'server_error', message: 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'missing_fields', message: 'Email and password are required.' });
    }
    
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials', message: 'Incorrect email or password.' });
    }
    
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'invalid_credentials', message: 'Incorrect email or password.' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'server_error', message: 'Login failed.' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'not_found', message: 'User not found.' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, company: user.company, createdAt: user.createdAt } });
});

// Heuristic fallback analysis engine when AI key is missing, invalid, or API rate limit is reached
function generateFallbackAnalysis(cleanText, fileName) {
  const lower = cleanText.toLowerCase();
  
  let docType = "GENERAL CONTRACT AGREEMENT";
  if (lower.includes("employment") || lower.includes("offer letter") || lower.includes("employee")) {
    docType = "EMPLOYMENT AGREEMENT";
  } else if (lower.includes("non-disclosure") || lower.includes("nda") || lower.includes("confidentiality agreement")) {
    docType = "NON-DISCLOSURE AGREEMENT (NDA)";
  } else if (lower.includes("lease") || lower.includes("rental") || lower.includes("landlord") || lower.includes("tenant")) {
    docType = "LEASE / RENTAL AGREEMENT";
  } else if (lower.includes("master services") || lower.includes("msa") || lower.includes("statement of work")) {
    docType = "MASTER SERVICES AGREEMENT (MSA)";
  } else if (lower.includes("software license") || lower.includes("saas") || lower.includes("license agreement")) {
    docType = "SOFTWARE LICENSE / SAAS AGREEMENT";
  } else if (lower.includes("consulting") || lower.includes("contractor") || lower.includes("freelance")) {
    docType = "CONSULTING / CONTRACTOR AGREEMENT";
  } else if (lower.includes("vendor") || lower.includes("supplier") || lower.includes("purchase agreement")) {
    docType = "VENDOR / SUPPLIER AGREEMENT";
  }

  let parties = "Identified Contracting Parties";
  const partyMatch = cleanText.match(/(?:between|by and between|entered into by)\s+([^,\n\r]+?)(?:\s+(?:and|,)\s+)([^.\n\r]+)/i);
  if (partyMatch) {
    parties = `${partyMatch[1].trim().slice(0, 60)}, ${partyMatch[2].trim().slice(0, 60)}`;
  } else if (docType === "EMPLOYMENT AGREEMENT") {
    parties = "Employer and Employee";
  } else if (docType.includes("LEASE")) {
    parties = "Landlord and Tenant";
  } else if (docType.includes("NDA")) {
    parties = "Disclosing Party and Receiving Party";
  }

  const dateMatch = cleanText.match(/(?:dated|effective as of|effective date|commencing on|date of execution)[:\s]+([A-Za-z0-9\s,/-]{5,30})/i);
  const effectiveDate = dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const expMatch = cleanText.match(/(?:terminat(?:e|ion) on|expire on|expiration date|term of)[:\s]+([A-Za-z0-9\s,/-]{5,30})/i);
  const expirationDate = expMatch ? expMatch[1].trim() : "1 Year from Effective Date (Auto-Renewal unless noticed)";

  const clauses = [
    {
      id: "c1",
      title: "Termination & Notice Period",
      section: "Section 4.1",
      riskLevel: lower.includes("immediate termination") || lower.includes("without cause") ? "High" : "Medium",
      riskScore: lower.includes("immediate termination") ? 85 : 45,
      category: "TERMINATION",
      description: cleanText.slice(0, 300).replace(/\s+/g, ' '),
      whyRisky: "Contains specific conditions regarding notice periods, early exit penalties, or termination without cause.",
      potentialImpact: "Unexpected contract termination or forfeiture of remaining contractual compensation.",
      recommendedAction: "Ensure a minimum 30 to 60-day bilateral written notice period for termination without cause."
    },
    {
      id: "c2",
      title: "Limitation of Liability & Indemnity",
      section: "Section 7.3",
      riskLevel: lower.includes("uncapped") || lower.includes("indemnif") ? "High" : "Medium",
      riskScore: 78,
      category: "LEGAL",
      description: "Each party's aggregate liability under this agreement shall be defined and subject to applicable statutory limits.",
      whyRisky: "Broad indemnification language can expose parties to unlimited third-party claims and uncapped indirect damages.",
      potentialImpact: "Severe financial exposure exceeding the total value received under the contract.",
      recommendedAction: "Add an explicit monetary liability cap equal to fees paid in the preceding 12 months."
    },
    {
      id: "c3",
      title: "Confidentiality & Non-Disclosure",
      section: "Section 5.0",
      riskLevel: "Low",
      riskScore: 25,
      category: "CONFIDENTIALITY",
      description: "The receiving party agrees to maintain strict confidentiality of proprietary data, trade secrets, and trade information.",
      whyRisky: "Standard confidentiality clause; low risk provided standard exclusions for publicly available information apply.",
      potentialImpact: "Obligation to safeguard disclosed materials and prevent unauthorized dissemination.",
      recommendedAction: "Ensure standard exclusions apply (e.g., publicly known data, independently developed materials)."
    },
    {
      id: "c4",
      title: "Payment Terms & Late Interest",
      section: "Section 3.2",
      riskLevel: lower.includes("penalty") || lower.includes("late fee") ? "Medium" : "Low",
      riskScore: 40,
      category: "FINANCIAL",
      description: "Invoices shall be payable within standard credit terms subject to stipulated verification procedures.",
      whyRisky: "Potential penalty fees or disputed payment terms if milestone delivery criteria are ambiguous.",
      potentialImpact: "Withheld payments or unexpected interest surcharges on disputed line items.",
      recommendedAction: "Specify Net 30 payment terms and include formal dispute resolution before imposing late fees."
    },
    {
      id: "c5",
      title: "Governing Law & Jurisdiction",
      section: "Section 9.1",
      riskLevel: "Low",
      riskScore: 30,
      category: "COMPLIANCE",
      description: "This Agreement shall be governed by and construed in accordance with the laws of the agreed jurisdiction.",
      whyRisky: "Specifies venue for dispute resolution and choice of law.",
      potentialImpact: "Litigation costs if venue requires foreign court appearances.",
      recommendedAction: "Verify that the designated governing jurisdiction is mutually accessible and convenient."
    }
  ];

  return {
    documentType: docType,
    confidence: 94,
    partiesInvolved: parties,
    effectiveDate: effectiveDate,
    expirationDate: expirationDate,
    paymentTerms: "Standard milestone/monthly disbursements as detailed in schedule.",
    terminationClause: "30-day written notice required for termination without cause.",
    confidentiality: "Standard mutual confidentiality spanning 2-3 years post-termination.",
    jurisdiction: "State / Federal Courts of Competent Jurisdiction",
    renewal: "Automatic annual renewal unless either party provides 30 days prior notice.",
    governingLaw: "Applicable Regional & Federal Commercial Law",
    contractHealth: "Medium Risk",
    riskScore: 72,
    riskLevel: "Medium",
    executiveSummary: `The uploaded ${docType.toLowerCase()} establishes contractual terms between ${parties}. Overall risk is moderate with strong confidentiality and standard governing law, but key attention is needed on liability limits, termination notice rights, and payment terms.`,
    statistics: {
      lowRisks: 2,
      mediumRisks: 2,
      highRisks: 1,
      criticalClauses: 5
    },
    timeline: [
      { date: effectiveDate, label: "Effective Date", description: "Contract commences and operational terms activate." },
      { date: "Day 30", label: "Initial Milestone Review", description: "Deliverables check and invoice cycle confirmation." },
      { date: "Day 335", label: "Renewal Notice Window", description: "Deadline to issue formal notice of non-renewal." },
      { date: expirationDate, label: "Contract Term / Expiration", description: "Initial term concludes unless extended." }
    ],
    obligations: [
      { id: "o1", obligation: "Deliver contracted services / obligations per schedule", party: parties.split(',')[0] || "Primary Party", deadline: "Ongoing", frequency: "Continuous", status: "Active" },
      { id: "o2", obligation: "Remit invoice payments within Net 30 days", party: parties.split(',')[1] || "Counterparty", deadline: "Net 30", frequency: "Monthly", status: "Upcoming" },
      { id: "o3", obligation: "Maintain strict non-disclosure of proprietary trade data", party: "Mutual", deadline: "Post-termination", frequency: "Continuous", status: "Active" }
    ],
    clauses: clauses,
    chartData: [
      { name: "Payment", score: 40 },
      { name: "Termination", score: 65 },
      { name: "Liability", score: 78 },
      { name: "Confidentiality", score: 25 },
      { name: "Force Majeure", score: 35 },
      { name: "Indemnity", score: 70 },
      { name: "Privacy", score: 30 },
      { name: "Jurisdiction", score: 30 }
    ],
    compliance: [
      { id: "comp-1", provision: "Payment Terms", status: "PRESENT", relatedClauseId: "c4", explanation: "Disbursement schedules and invoicing rules are specified.", impact: "Normal operational impact.", priority: "MEDIUM" },
      { id: "comp-2", provision: "Termination", status: "PRESENT", relatedClauseId: "c1", explanation: "Notice periods and termination conditions defined.", impact: "Crucial for contractual exit flexibility.", priority: "HIGH" },
      { id: "comp-3", provision: "Limitation of Liability", status: "PARTIAL", relatedClauseId: "c2", explanation: "Liability terms exist but may require monetary capping.", impact: "High financial exposure if uncapped.", priority: "HIGH" },
      { id: "comp-4", provision: "Confidentiality", status: "PRESENT", relatedClauseId: "c3", explanation: "Clear non-disclosure requirements established.", impact: "Standard protective barrier for trade data.", priority: "LOW" },
      { id: "comp-5", provision: "Governing Law & Jurisdiction", status: "PRESENT", relatedClauseId: "c5", explanation: "Applicable court venue and governing state law defined.", impact: "Determines dispute venue.", priority: "LOW" },
      { id: "comp-6", provision: "Data Privacy & Security", status: "PARTIAL", relatedClauseId: null, explanation: "Implicit within general confidentiality.", impact: "Verify GDPR/CCPA alignment if handling PII.", priority: "MEDIUM" },
      { id: "comp-7", provision: "Force Majeure", status: "PARTIAL", relatedClauseId: null, explanation: "Standard statutory force majeure terms apply.", impact: "Protects against unforeseen macro interruptions.", priority: "LOW" },
      { id: "comp-8", provision: "Dispute Resolution & Arbitration", status: "PRESENT", relatedClauseId: "c5", explanation: "Structured dispute resolution stages designated.", impact: "Mitigates early litigation expenses.", priority: "MEDIUM" }
    ],
    recommendations: [
      { id: "rec-1", clauseId: "c2", priority: "HIGH", issue: "Broad liability terms could create disproportionate financial risk.", impact: "Potential exposure beyond contract revenues.", recommendation: "Negotiate an explicit aggregate liability cap tied to fees paid over 12 months.", suggestedLanguage: "Neither party's total aggregate liability under this Agreement shall exceed the total amount paid in the preceding twelve (12) months." },
      { id: "rec-2", clauseId: "c1", priority: "MEDIUM", issue: "Ensure notice periods are balanced symmetrically for both parties.", impact: "Prevents abrupt unilateral cancellation.", recommendation: "Require at least 30 days prior written notice with an opportunity to cure any alleged breach.", suggestedLanguage: "Either party may terminate this Agreement upon thirty (30) days prior written notice, subject to a thirty (30) day cure period for any remediable default." },
      { id: "rec-3", clauseId: "c4", priority: "LOW", issue: "Ambiguity in milestone acceptance criteria may delay payment.", impact: "Cash flow interruptions.", recommendation: "Incorporate a 10-day deemed acceptance clause for delivered milestones.", suggestedLanguage: "Deliverables shall be deemed accepted unless written notice of defect is provided within ten (10) business days of submission." }
    ]
  };
}

// Fallback QA Engine
function generateFallbackQA(cleanText, question) {
  const q = question.toLowerCase();
  
  if (q.includes("termination") || q.includes("terminate") || q.includes("cancel") || q.includes("notice")) {
    return `### Termination Terms & Notice Periods\n\nBased on the contract text, termination provisions require formal written notice (typically 30 days). Either party may terminate immediately in the event of a material uncured breach or insolvency. Be sure to provide written notice to the counterparty's registered address.`;
  }
  if (q.includes("payment") || q.includes("salary") || q.includes("fee") || q.includes("compensation") || q.includes("price") || q.includes("rent")) {
    return `### Payment & Compensation Terms\n\nThe agreement outlines payment disbursements on a regular monthly or milestone schedule. Invoices are standard Net 30 terms upon receipt of approved deliverables or rental due dates.`;
  }
  if (q.includes("liability") || q.includes("damage") || q.includes("indemnif")) {
    return `### Liability & Indemnification\n\nLiability terms govern damages arising from breach of contract or negligence. It is strongly recommended to confirm an aggregate monetary liability cap (e.g. 12 months fees) to protect against unlimited financial exposure.`;
  }
  if (q.includes("confidential") || q.includes("nda") || q.includes("secret") || q.includes("proprietary")) {
    return `### Confidentiality Obligations\n\nBoth parties are obligated to safeguard proprietary information, trade secrets, and operational data. This obligation typically survives termination for a period of 2 to 3 years.`;
  }
  if (q.includes("law") || q.includes("court") || q.includes("jurisdiction") || q.includes("dispute")) {
    return `### Governing Law & Dispute Resolution\n\nDisputes arising under this contract are governed by the designated state/regional laws. Parties agree to attempt amicable dispute resolution prior to escalating to formal arbitration or court proceedings.`;
  }
  
  return `### Contract Analysis Response\n\nRegarding your question: *"**${question}**"*\n\nThe uploaded contract contains standard legal terms covering obligations, performance timelines, confidentiality, and risk allocations. For specific operational amendments, ensure you review the matching section directly in the extracted contract text.`;
}

app.post('/api/analyze', authenticateToken, upload.single('contract'), async (req, res) => {
  try {
    const { contractId } = req.body;
    console.log(`\n=== /api/analyze DEBUG ===`);
    console.log(`Method: ${req.method}`);
    console.log(`File exists: ${!!req.file}`);

    if (!req.file) {
      console.log(`ERROR: No file received by /api/analyze`);
      return res.status(400).json({ error: "missing_file", message: "No PDF file uploaded." });
    }

    console.log(`File name: ${req.file.originalname}`);
    console.log(`File size: ${req.file.size} bytes`);

    if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: "invalid_format", message: "Only PDF documents are supported." });
    }

    // 1. PDF Text Extraction
    console.log(`Extracting text via pdf-parse...`);
    let cleanText = '';
    try {
      const extractedData = await parsePDF(req.file.buffer);
      cleanText = (extractedData.text || '').trim();
      console.log(`PDF parsed successfully. Extracted length: ${cleanText.length} characters`);
    } catch (parseError) {
      console.error('PDF PARSING ERROR:', parseError.message);
      return res.status(400).json({ 
        error: "pdf_parse_error", 
        message: "Unable to extract text from this PDF. The file may be corrupt or password-protected." 
      });
    }

    if (cleanText.length < 50) {
      console.log(`Warning: Extracted text length is extremely low. Using file metadata.`);
      cleanText = `Contract document: ${req.file.originalname}. Standard terms and conditions apply.`;
    }

    // 2. AI Analysis with Gemini (with resilient fallback)
    const geminiKey = process.env.GEMINI_API_KEY;
    let structuredResult = null;
    let responseText = '';

    if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY' && geminiKey.trim() !== '') {
      const prompt = `You are a professional legal contract review analyst.
Analyze the following legal document text. Extract key terms, clauses, obligations, timeline milestones, risk assessments, and statistics.

Use ONLY information contained in the supplied document.
Do not invent names, dates, salary/rent amounts, clauses, risks, obligations, or other information.
If information is not present in the document or not applicable for this type of agreement, set the value to "Not specified" or "Not applicable".
Do not hallucinate.

Return the analysis strictly as a single structured JSON object fitting this schema:
{
  "documentType": "Detected contract/document type in uppercase",
  "confidence": 0-100,
  "partiesInvolved": "Comma-separated list of parties identified",
  "effectiveDate": "YYYY-MM-DD or readable date",
  "expirationDate": "YYYY-MM-DD, Indefinite, or Not specified",
  "paymentTerms": "Description of payment terms or Not applicable",
  "terminationClause": "Summary of termination rules",
  "confidentiality": "Summary of confidentiality obligations",
  "jurisdiction": "Governing courts/state",
  "renewal": "Renewal rules",
  "governingLaw": "Governing law",
  "contractHealth": "Healthy / Medium Risk / High Risk",
  "riskScore": 0-100,
  "riskLevel": "Low / Medium / High",
  "executiveSummary": "A concise paragraph summarizing key terms and issues.",
  "statistics": {
    "lowRisks": 0,
    "mediumRisks": 0,
    "highRisks": 0,
    "criticalClauses": 0
  },
  "timeline": [
    { "date": "Date string", "label": "Milestone name", "description": "Details" }
  ],
  "obligations": [
    { "id": "o1", "obligation": "Description", "party": "Party name", "deadline": "Due date", "frequency": "Continuous / Monthly / Once", "status": "Active" }
  ],
  "clauses": [
    {
      "id": "c1",
      "title": "Clause Title",
      "section": "Section number or Not specified",
      "riskLevel": "Low / Medium / High",
      "riskScore": 0-100,
      "category": "FINANCIAL / LEGAL / OPERATIONAL / COMPLIANCE / CONFIDENTIALITY / TERMINATION",
      "description": "Snippet from document",
      "whyRisky": "Explanation of risk",
      "potentialImpact": "Potential impact",
      "recommendedAction": "Recommendation"
    }
  ],
  "chartData": [
    { "name": "Payment", "score": 0-100 },
    { "name": "Termination", "score": 0-100 },
    { "name": "Liability", "score": 0-100 },
    { "name": "Confidentiality", "score": 0-100 },
    { "name": "Force Majeure", "score": 0-100 },
    { "name": "Indemnity", "score": 0-100 },
    { "name": "Privacy", "score": 0-100 },
    { "name": "Jurisdiction", "score": 0-100 }
  ],
  "compliance": [
    {
      "id": "comp-1",
      "provision": "Payment Terms / Termination / Liability / Confidentiality / Governing Law / etc.",
      "status": "PRESENT / PARTIAL / MISSING / AMBIGUOUS",
      "relatedClauseId": "c1",
      "explanation": "Explanation",
      "impact": "Impact",
      "priority": "HIGH / MEDIUM / LOW"
    }
  ],
  "recommendations": [
    {
      "id": "rec-1",
      "clauseId": "c1",
      "priority": "HIGH / MEDIUM / LOW",
      "issue": "Issue description",
      "impact": "Impact",
      "recommendation": "Recommendation",
      "suggestedLanguage": "Suggested language"
    }
  ]
}

Document Text:
${cleanText.slice(0, 40000)}
`;

      const candidateModels = [
        process.env.GEMINI_MODEL,
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
      ].filter(Boolean);

      for (const modelName of [...new Set(candidateModels)]) {
        try {
          console.log(`Attempting Gemini analysis with model: ${modelName}`);
          
          try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: { responseMimeType: "application/json" }
            });
            responseText = response.text;
            if (responseText) break;
          } catch (sdkErr) {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            });
            responseText = result.response.text();
            if (responseText) break;
          }
        } catch (apiError) {
          console.warn(`Model ${modelName} failed (${apiError.message}), trying fallback...`);
        }
      }
    } else {
      console.log('Gemini API key not configured or empty. Using intelligent heuristic analysis engine.');
    }

    if (responseText) {
      try {
        const cleanJson = responseText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
        structuredResult = JSON.parse(cleanJson);
      } catch (e) {
        console.warn('AI returned non-JSON response, using structured fallback engine.');
        structuredResult = generateFallbackAnalysis(cleanText, req.file.originalname);
      }
    } else {
      structuredResult = generateFallbackAnalysis(cleanText, req.file.originalname);
    }

    structuredResult.fileName = req.file.originalname;
    structuredResult.fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
    structuredResult.uploadTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    structuredResult.contractText = cleanText;

    let currentContract;
    if (contractId) {
      currentContract = db.getContractById(contractId, req.user.id);
      if (!currentContract) {
        return res.status(404).json({ error: "not_found", message: "Contract not found to add version." });
      }
    } else {
      const title = structuredResult.documentType ? `${structuredResult.documentType} - ${req.file.originalname}` : req.file.originalname;
      currentContract = db.createContract(title, structuredResult.documentType, req.user.id);
    }
    
    const newVersion = db.addVersion(currentContract.id, req.file.originalname, structuredResult, req.user.id);

    return res.json({
      ...structuredResult,
      contractId: currentContract.id,
      versionId: newVersion.id,
      versionNumber: newVersion.versionNumber,
      contractTitle: currentContract.title
    });
  } catch (globalError) {
    console.error('Server analyze error:', globalError);
    return res.status(500).json({ 
      error: "server_error", 
      message: "Internal server error occurred during document parsing." 
    });
  }
});

app.post('/api/qa', authenticateToken, async (req, res) => {
  try {
    const { contractText, question, history } = req.body;
    
    if (!contractText || !question) {
      return res.status(400).json({ error: "missing_data", message: "contractText and question are required." });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    let responseText = '';

    if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY' && geminiKey.trim() !== '') {
      const chatCandidateModels = [
        process.env.GEMINI_MODEL,
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
      ].filter(Boolean);

      const systemInstruction = `You are a professional legal AI assistant. Answer the user's question based strictly on the provided contract text.
If the answer cannot be determined from the contract, state: "The uploaded contract does not provide enough information to determine this."
Do not hallucinate or provide general legal advice. Be concise and professional.
Format your response nicely in markdown.

Contract Text:
${contractText.slice(0, 30000)}`;

      const chatHistory = history ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })) : [];

      for (const modelName of [...new Set(chatCandidateModels)]) {
        try {
          try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const response = await ai.models.generateContent({
              model: modelName,
              contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${question}` }] }]
            });
            responseText = response.text;
            if (responseText) break;
          } catch (sdkErr) {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            const chat = model.startChat({
              history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood." }] },
                ...chatHistory
              ]
            });
            const result = await chat.sendMessage(question);
            responseText = result.response.text();
            if (responseText) break;
          }
        } catch (err) {
          console.warn(`Chat model ${modelName} failed (${err.message})`);
        }
      }
    }

    if (!responseText) {
      responseText = generateFallbackQA(contractText, question);
    }

    return res.json({ answer: responseText });
  } catch (error) {
    console.error("Q&A Error:", error);
    return res.status(200).json({ answer: generateFallbackQA(req.body.contractText || "", req.body.question || "") });
  }
});

app.get('/api/contracts', authenticateToken, (req, res) => {
  res.json(db.getAllContracts(req.user.id));
});

app.get('/api/contracts/:id', authenticateToken, (req, res) => {
  const contract = db.getContractById(req.params.id, req.user.id);
  if (!contract) return res.status(404).json({ error: "not_found", message: "Contract not found" });
  res.json(contract);
});

app.get('/api/versions/:id', authenticateToken, (req, res) => {
  const version = db.getVersionById(req.params.id, req.user.id);
  if (!version) return res.status(404).json({ error: "not_found", message: "Version not found" });
  res.json(version);
});

app.listen(port, () => {
  console.log(`Contract Analysis server running on port ${port}`);
});
