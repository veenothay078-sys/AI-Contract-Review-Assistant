# Contract Review Assistant

An intelligent, AI-powered contract analysis and review platform that accelerates legal document inspection. Upload PDF contracts to automatically extract clauses, identify high-risk conditions, detect critical deadlines, generate executive summaries, and interact with an AI assistant to query document details with precision.

---

## 📌 Project Purpose

Reviewing lengthy legal contracts (such as Employment Agreements, NDAs, Service Agreements, Vendor Contracts, and Rental Agreements) is time-consuming, prone to human oversight, and costly. 

**Contract Review Assistant** automates the initial review pipeline by leveraging Google's Gemini Generative AI alongside robust PDF parsing to:
- Surface unfavorable or high-risk clauses.
- Extract key dates, deadlines, renewal periods, and financial obligations.
- Provide plain-English summaries and clause explanations.
- Enable conversational Q&A grounded strictly in the uploaded contract's content.

---

## ✨ Main Features

- 📄 **Intelligent PDF Parsing & Text Extraction**: Extracts clean text from uploaded PDF contracts securely in-memory.
- 🤖 **AI-Powered Contract Analysis**: Uses Google Gemini to detect contract type, parties involved, governing law, and key terms.
- ⚠️ **Risk Assessment & Severity Scoring**: Flags potential liabilities, aggressive non-competes, one-sided termination terms, and indemnification risks with risk levels (Low, Medium, High, Critical).
- 🔍 **Clause Extraction & Categorization**: Breaks down contracts into categorized clauses (Confidentiality, Compensation, Termination, Intellectual Property, Liability, Dispute Resolution).
- 📅 **Dates & Obligations Tracking**: Highlights effective dates, expiration dates, renewal windows, notice periods, and milestones.
- 💬 **Interactive Contract Chatbot (Q&A)**: Grounded conversational assistant allowing users to ask specific questions about clauses and obligations.
- 📊 **Executive Reports & PDF Export**: Generates comprehensive contract audit summaries ready for export.
- 🔐 **User Authentication & Dashboard**: Secure JWT-based registration and login, saving review history and past contract analyses per user.

---

## 🛠 Technologies Used

### Frontend (`/client`)
- **React.js 18** (Vite build tool)
- **Tailwind CSS** (Styling & responsive layout)
- **Framer Motion** (Smooth UI animations & transitions)
- **Lucide React** (Modern iconography)
- **Recharts** (Visual risk metrics & data visualization)
- **React Markdown** (Markdown formatting in AI responses)
- **html2pdf.js** (Client-side report export)

### Backend (`/server`)
- **Node.js & Express.js** (REST API)
- **@google/generative-ai** (Google Gemini API integration)
- **Multer** (Memory-buffered file upload handling)
- **pdfjs-dist & pdf-parse** (PDF text extraction)
- **JSON Web Tokens (JWT) & bcryptjs** (Secure authentication & password hashing)
- **CORS & dotenv** (Cross-origin resource sharing & configuration management)

---

## 📂 Project Structure

```text
contract_review_assist/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # UI Components & Modules
│   │   │   ├── auth/           # Login & Register modals/views
│   │   │   ├── ClauseDetailsModal.jsx
│   │   │   ├── ClauseExtraction.jsx
│   │   │   ├── ComparisonModule.jsx
│   │   │   ├── ComplianceModule.jsx
│   │   │   ├── DashboardModule.jsx
│   │   │   ├── DatesObligations.jsx
│   │   │   ├── ExecutiveReport.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── MyContracts.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── QAModule.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Skeletons.jsx
│   │   │   ├── SummaryModule.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── TopHeader.jsx
│   │   │   ├── UploadModule.jsx
│   │   │   └── VersionHistory.jsx
│   │   ├── contexts/           # React Contexts (AuthContext)
│   │   ├── data/               # Mock & fallback data
│   │   ├── App.jsx             # Main Application Component
│   │   ├── index.css           # Global Styles & Tailwind Directives
│   │   └── main.jsx            # React DOM Root
│   ├── .env.example            # Sample client environment configuration
│   ├── index.html              # HTML entry point
│   ├── package.json            # Client dependencies & scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite build configuration
│
├── server/                     # Express Backend Application
│   ├── data/                   # Local database storage (database.json)
│   ├── db.js                   # JSON-backed database access helper
│   ├── gemini-diag.mjs         # Gemini API diagnostic utility
│   ├── model-test.mjs          # Gemini model test utility
│   ├── pdf-parser.cjs          # PDF text parsing helper
│   ├── server.js               # Express Server & API endpoints
│   ├── test-pdf.js             # PDF extraction test script
│   ├── .env.example            # Sample server environment configuration
│   └── package.json            # Server dependencies & scripts
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Clone the Repository

```bash
git clone https://github.com/veenothay078-sys/AI-Contract-Review-Assistant.git
cd AI-Contract-Review-Assistant
```

---

### 2. Configure Environment Variables

#### Backend (`/server/.env`)
Create a `.env` file in the `server` directory based on `server/.env.example`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your settings:

```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

#### Frontend (`/client/.env`)
Create a `.env` file in the `client` directory based on `client/.env.example` (optional if using defaults):

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:3001
```

---

### 3. Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd server
npm start
```
*The server will run on `http://localhost:3001`.*

### 2. Start the Frontend Development Server
In a separate terminal window:
```bash
cd client
npm run dev
```
*The React application will launch at `http://localhost:5173` (or the port specified by Vite).*

---

## 💡 Example Usage

1. **Register / Log In**: Open the web application and sign up for an account.
2. **Upload Contract**: Drag and drop or browse to upload any contract in PDF format (e.g., NDA, Employment Agreement, SLA).
3. **Review Analysis**:
   - View the **Executive Summary** and overall contract assessment score.
   - Inspect **Extracted Clauses** categorized by subject matter.
   - Check **Risk Analysis** for flagged high-risk clauses, potential pitfalls, and suggested amendments.
   - Review **Dates & Deadlines** on the timeline view.
4. **Chat with AI Assistant**: Use the **Q&A Module** to ask questions like:
   - *"What is the notice period required for termination?"*
   - *"Are there any non-compete restrictions after employment?"*
   - *"Who owns the intellectual property created during this engagement?"*
5. **Export Report**: Download a formatted audit report for offline review.

---

## 🛡 Security & Privacy

- Sensitive environment variables (`.env`, API keys, JWT secrets) are excluded from version control via `.gitignore`.
- Password hashes are computed using bcrypt with salt rounds before storage.
- All PDF files are processed in-memory and are not permanently exposed without authentication.
