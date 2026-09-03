import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
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

app.post('/api/analyze', authenticateToken, upload.single('contract'), async (req, res) => {
  try {
    const { contractId } = req.body;
    console.log(`\n=== /api/analyze DEBUG ===`);
    console.log(`Method: ${req.method}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    console.log(`Content-Length: ${req.headers['content-length']}`);
    console.log(`File exists: ${!!req.file}`);

    if (!req.file) {
      console.log(`ERROR: No file received by /api/analyze`);
      return res.status(400).json({ error: "missing_file", message: "No PDF file uploaded." });
    }

    console.log(`File name: ${req.file.originalname}`);
    console.log(`File mimetype: ${req.file.mimetype}`);
    console.log(`File size: ${req.file.size}`);
    console.log(`Buffer exists: ${!!req.file.buffer}`);
    console.log(`Buffer length: ${req.file.buffer ? req.file.buffer.length : 0}`);
    
    if (req.file.buffer && req.file.buffer.length >= 5) {
      const hex = req.file.buffer.slice(0, 5).toString('hex').match(/../g).join(' ');
      console.log(`First 5 bytes in hexadecimal: ${hex}`);
    }

    if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      console.log(`Error: Invalid format (${req.file.mimetype})`);
      return res.status(400).json({ error: "invalid_format", message: "Only PDF documents are supported." });
    }

    // 1. PDF Text Extraction
    console.log(`Extracting text via pdf-parse...`);
    let cleanText = '';
    try {
      const extractedData = await parsePDF(req.file.buffer);
      cleanText = (extractedData.text || '').trim();
      console.log(`PDF parsed successfully. Extracted text length: ${cleanText.length} characters`);
      
    } catch (parseError) {
      console.error('\n--- PDF PARSING ERROR ---');
      console.error(`ERROR NAME: ${parseError.name}`);
      console.error(`ERROR MESSAGE: ${parseError.message}`);
      console.error(`ERROR STACK: \n${parseError.stack}`);
      console.error('---------------------------\n');
      
      // Return accurate error — PDF extraction failed, NOT a Gemini issue
      return res.status(400).json({ 
        error: "pdf_parse_error", 
        message: "Unable to extract text from this PDF. The file may be corrupt or password-protected." 
      });
    }

    // 2. Handle Scanned / Empty PDFs
    if (cleanText.length < 150) {
      console.log(`Warning: Extracted text length is extremely low. Likely scanned PDF.`);
      return res.status(400).json({ 
        error: "scanned", 
        message: "This PDF appears to be scanned or contains no selectable text. OCR processing is required." 
      });
    }
    
    console.log(`Document text extraction successful. Proceeding to Gemini analysis.`);

    // 3. AI Analysis with Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(500).json({ 
        error: "missing_api_key", 
        message: "Gemini API key is not configured on the server." 
      });
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    console.log(`Using Gemini model: ${modelName}`);
    const prompt = `You are a professional legal contract review analyst.
Analyze the following legal document text. Extract key terms, clauses, obligations, timeline milestones, risk assessments, and statistics.

Use ONLY information contained in the supplied document.
Do not invent names, dates, salary/rent amounts, clauses, risks, obligations, or other information.
If information is not present in the document or not applicable for this type of agreement, set the value to "Not specified" or "Not applicable".
Do not hallucinate.

First, identify the document type (e.g. EMPLOYMENT / OFFER LETTER, RENTAL / LEASE AGREEMENT, NDA, SERVICE AGREEMENT, VENDOR AGREEMENT, etc.).

Return the analysis strictly as a single structured JSON object fitting this schema:
{
  "documentType": "Detected contract/document type in uppercase",
  "confidence": 0-100,
  "partiesInvolved": "Comma-separated list of parties identified",
  "effectiveDate": "YYYY-MM-DD or Not specified",
  "expirationDate": "YYYY-MM-DD, Indefinite, or Not specified",
  "paymentTerms": "Description of payment terms, salary, rent, or 'Not applicable'",
  "terminationClause": "Summary of termination rules or 'Not specified'",
  "confidentiality": "Summary of confidentiality obligations or 'Not specified'",
  "jurisdiction": "Governing courts/state or 'Not specified'",
  "renewal": "Renewal rules or 'Not specified'",
  "governingLaw": "Governing law or 'Not specified'",
  "contractHealth": "Healthy / Medium Risk / High Risk (based on overall risks)",
  "riskScore": 0-100, // Overall protection index where 100 is completely safe/low risk and 0 is extremely dangerous/unfavorable
  "riskLevel": "Low / Medium / High", // Overall risk classification
  "executiveSummary": "A concise paragraph summarizing the key terms, balance of terms, and critical issues to watch out for.",
  "statistics": {
    "lowRisks": 0,
    "mediumRisks": 0,
    "highRisks": 0,
    "criticalClauses": 0
  },
  "timeline": [
    {
      "date": "Date string (e.g. 01 Oct 2026)",
      "label": "Milestone name (e.g. Contract Start, Expiry, Notice Deadline)",
      "description": "Details about this milestone"
    }
  ],
  "obligations": [
    {
      "id": "Unique string id (e.g. o1, o2)",
      "obligation": "Description of the compliance obligation",
      "party": "Party responsible for performing the obligation",
      "deadline": "Due date or condition",
      "frequency": "Continuous / Monthly / Once / etc.",
      "status": "Active / Upcoming / Overdue / Completed"
    }
  ],
  "clauses": [
    {
      "id": "Unique clause id (e.g. c1, c2)",
      "title": "Clause Title (e.g. Payment Clause, Termination Clause, Liability, Confidentiality, Force Majeure, Indemnification, Data Privacy, Jurisdiction, Non-Compete, Intellectual Property)",
      "section": "Section number (e.g. Section 8.2) or 'Not specified'",
      "riskLevel": "Low / Medium / High",
      "riskScore": 0-100, // risk score where 100 is highest risk and 0 is lowest risk
      "category": "FINANCIAL / LEGAL / OPERATIONAL / COMPLIANCE / CONFIDENTIALITY / TERMINATION",
      "description": "The exact original extracted clause text or a close quote snippet from the document",
      "whyRisky": "Clear explanation of why this clause presents risk, or 'Standard clause' if low risk",
      "potentialImpact": "Potential business or financial impact of this clause",
      "recommendedAction": "Actionable recommendation for negotiation or mitigation"
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
      "id": "Unique string id",
      "provision": "Name of provision (e.g. Payment Terms, Termination, Confidentiality, Liability, Indemnification, Governing Law, Jurisdiction, Renewal, Intellectual Property, Data Privacy, Dispute Resolution, Force Majeure, Non-Compete, Notice Requirements, Breach, Contract Duration)",
      "status": "PRESENT / PARTIAL / MISSING / AMBIGUOUS",
      "relatedClauseId": "id of the related clause from the clauses array, or null if missing",
      "explanation": "Why this provision is flagged as such",
      "impact": "Potential business or legal impact",
      "priority": "HIGH / MEDIUM / LOW"
    }
  ],
  "recommendations": [
    {
      "id": "Unique string id",
      "clauseId": "id of the related clause from the clauses array, or null if it's for a missing provision",
      "priority": "HIGH / MEDIUM / LOW",
      "issue": "Description of the risk or issue",
      "impact": "Potential impact",
      "recommendation": "Actionable recommendation for negotiation",
      "suggestedLanguage": "Suggested negotiation language or 'N/A'"
    }
  ]
}

Document Text:
${cleanText}
`;

    let responseText = '';
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      
      responseText = result.response.text();
      console.log(`Gemini response received successfully. Response length: ${responseText.length} characters.`);
    } catch (apiError) {
      console.error(`\n=== GEMINI API ERROR ===`);
      console.error(`Model used: ${modelName}`);
      console.error(`HTTP Status: ${apiError.status ?? 'N/A'}`);
      console.error(`Message: ${apiError.message}`);
      console.error(`========================\n`);
      return res.status(502).json({ 
        error: "api_failed", 
        message: "AI analysis service is currently unavailable. Please try again later.",
        details: apiError.message 
      });
    }

    if (!responseText) {
      return res.status(502).json({ 
        error: "empty_response", 
        message: "AI did not return any analysis results." 
      });
    }

    try {
      const structuredResult = JSON.parse(responseText.trim());
      
      // Ensure file metadata matches
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
    } catch (parseError) {
      return res.status(502).json({ 
        error: "malformed_json", 
        message: "AI response was not in a valid JSON format.",
        raw: responseText 
      });
    }
  } catch (globalError) {
    console.error(globalError);
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
    if (!geminiKey) {
      return res.status(500).json({ error: "missing_api_key", message: "Gemini API key is not configured." });
    }

    // Default to a capable model for chat
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemInstruction = `You are a professional legal AI assistant. Answer the user's question based strictly on the provided contract text.
If the answer cannot be determined from the contract, state: "The uploaded contract does not provide enough information to determine this."
Do not hallucinate or provide general legal advice. Be concise and professional.
Format your response nicely in markdown. If a specific clause is relevant, mention it.

Contract Text:
${contractText}`;

    const chatHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) : [];

    // Simple exponential backoff for rate limits/503
    let retries = 3;
    let delay = 1000;
    let responseText = '';
    
    while (retries > 0) {
      try {
        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: systemInstruction }] },
            { role: "model", parts: [{ text: "Understood. I will answer based on the contract text." }] },
            ...chatHistory
          ]
        });
        const result = await chat.sendMessage(question);
        responseText = result.response.text();
        break;
      } catch (error) {
        if (error.status === 429 || error.status === 503 || error.status === 500) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }

    return res.json({ answer: responseText });
  } catch (error) {
    console.error("Q&A Error:", error);
    return res.status(502).json({ error: "api_failed", message: "Failed to generate answer. Please try again." });
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
