# Coding Instructions for AI Agents

## 1. Project Overview

This project is an **AI Contract Review Assistant** that helps users upload and analyze legal contract documents.

The application allows users to:

* Upload contract documents such as employment agreements, rental agreements, NDAs, service agreements, offer letters, etc.
* Extract text from uploaded PDF documents using PDF parsing/OCR when required.
* Analyze contracts using an AI model.
* Identify important clauses and contractual obligations.
* Detect potential risks and unusual or unfavorable clauses.
* Extract important dates, deadlines, renewal periods, and notice periods.
* Provide explanations of detected clauses and risks.
* Allow users to ask questions about the uploaded contract through an AI-powered chatbot.
* Store contract and analysis information for later access.

The backend provides REST APIs for authentication, contract management, document processing, AI analysis, chatbot interactions, and related operations.

---

## 2. Tech Stack & Environment

### Frontend

* React.js
* JavaScript
* HTML/CSS
* Axios or equivalent HTTP client

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI

* Gemini API / Generative AI
* Keep AI provider-specific logic isolated inside services.

### Document Processing

* PDF text extraction
* OCR when required for scanned/image-based documents

### Authentication

* JWT-based authentication
* HTTP-only cookies where applicable

---

## 3. Project Structure

Follow the existing project structure. Do not introduce a new architectural structure unless it is necessary and approved.

Recommended backend structure:

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── swagger/
├── server.js
└── package.json
```

### Responsibilities

* `config/` — Database, AI, environment, and application configuration.
* `controllers/` — Handle HTTP requests and responses.
* `dao/` — Handle database interactions.
* `models/` — Mongoose schemas and models.
* `routes/` — Define API endpoints and map them to controllers.
* `services/` — Business logic, document processing, AI processing, and orchestration.
* `middleware/` — Authentication, validation, error handling, uploads, etc.
* `utils/` — Reusable helper functions.
* `swagger/` — Swagger/OpenAPI documentation and models.
* `server.js` — Application entry point.

---

## 4. Architecture Pattern

Follow a strict:

**Route → Controller → Service → DAO → Model**

architecture.

### Routes

Routes must only:

* Define HTTP methods and endpoints.
* Apply required middleware/validators.
* Map requests to controller functions.

Routes must not contain business logic or database queries.

### Controllers

Controllers must:

* Receive and validate HTTP requests.
* Extract parameters/body/query information.
* Call the appropriate service.
* Return the appropriate HTTP response.
* Handle request-level validation errors.

Controllers should not contain complex business logic or direct database queries.

### Services

Services contain the application's business logic.

Examples:

* Contract analysis orchestration.
* AI prompt construction.
* Contract text preprocessing.
* Risk analysis.
* Clause extraction.
* Deadline/date extraction.
* Chatbot context preparation.
* Combining document-processing and AI results.

### DAO

DAO functions are responsible for database operations.

Examples:

* Create contract.
* Find contract by ID.
* Find contracts belonging to a user.
* Update analysis results.
* Delete contract.
* Store/retrieve chat history.

DAOs should not contain application-level business logic.

### Models

Models must contain Mongoose schemas and database-level definitions.

---

## 5. Approval Requirement

**Always get user approval before making changes to the project.**

Before:

* Creating files.
* Modifying files.
* Deleting files.
* Changing existing APIs.
* Changing database schemas.
* Installing dependencies.
* Changing environment configuration.
* Changing authentication behavior.
* Refactoring existing architecture.
* Modifying AI prompts or analysis logic.

First explain:

1. What needs to be changed.
2. Which files will be affected.
3. Why the change is required.
4. Any potential impact.

Then wait for explicit approval.

Do not make changes automatically.

---

## 6. Existing Code First

Before implementing a feature:

1. Inspect the existing project structure.
2. Identify related routes, controllers, services, DAOs, models, and utilities.
3. Reuse existing functionality where possible.
4. Follow existing naming conventions.
5. Do not create duplicate utilities or APIs.
6. Do not rewrite working code unnecessarily.
7. Do not introduce a new library if the existing project already provides the required functionality.

Prefer small, focused changes over large refactors.

---

## 7. Authentication & Authorization

Authenticated APIs must verify the user's identity before accessing private contract information.

Use the existing authentication middleware whenever available.

Never:

* Trust a user ID supplied directly by the client when it can be obtained from the authenticated JWT.
* Allow one user to access another user's contracts.
* Expose private contract documents or analysis results without authorization.

For protected endpoints:

```text
Request
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Service
   ↓
DAO
```

Return:

* `401` for unauthenticated requests.
* `403` for authenticated users without sufficient permission.
* `404` when an authorized user requests a resource that does not exist.

---

## 8. Contract Management

A contract should be associated with the authenticated user.

Typical contract information may include:

* User ID
* Contract name
* Original file name
* File type
* Extracted text
* Upload date
* Analysis status
* Summary
* Clauses
* Risks
* Important dates
* Deadlines
* AI analysis metadata where required

Do not store sensitive information unnecessarily.

When adding or modifying a contract model:

* Preserve existing fields.
* Use appropriate Mongoose types.
* Add indexes only when justified.
* Avoid breaking existing documents.
* Consider backward compatibility.

---

## 9. Document Processing

Contract processing should be separated from AI analysis.

Recommended flow:

```text
Upload Contract
      ↓
Validate File
      ↓
Extract Text
      ↓
OCR if Required
      ↓
Clean/Normalize Text
      ↓
AI Analysis
      ↓
Structured Result
      ↓
Store Result
```

Do not send raw files directly to unrelated business logic.

Handle:

* Empty documents.
* Unsupported file formats.
* Corrupted PDFs.
* Scanned PDFs.
* Very large documents.
* Extraction failures.
* AI processing failures.

Return meaningful errors instead of exposing internal stack traces.

---

## 10. AI Integration

AI provider-specific implementation must be isolated inside the service layer.

Do not call the Gemini API directly from:

* Routes.
* Controllers.
* DAOs.
* React components.

Use a dedicated AI service.

Example conceptual structure:

```text
Controller
    ↓
Contract Service
    ↓
AI Service
    ↓
Gemini API
```

AI responses must be treated as **untrusted external output**.

Validate and normalize AI-generated structured data before storing it.

Do not assume that the AI will always:

* Return valid JSON.
* Return all requested fields.
* Follow the requested format.
* Correctly identify every clause or risk.

Handle malformed or incomplete AI responses gracefully.

---

## 11. Contract Analysis

Contract analysis should produce structured information where possible.

Potential analysis sections:

### Summary

A concise explanation of what the contract is about.

### Clauses

Identify relevant clauses such as:

* Payment.
* Salary/compensation.
* Termination.
* Confidentiality.
* Non-disclosure.
* Non-compete.
* Intellectual property.
* Liability.
* Indemnification.
* Governing law.
* Dispute resolution.
* Renewal.
* Notice period.
* Leave/benefits where applicable.

### Risks

Each detected risk should ideally contain:

* Risk title.
* Severity.
* Relevant clause.
* Explanation.
* Reason for concern.
* Suggested consideration.

### Important Dates

Extract:

* Start date.
* End date.
* Expiry date.
* Renewal date.
* Notice deadline.
* Payment deadlines.
* Other relevant dates.

Do not present AI output as guaranteed legal advice.

The application should clearly distinguish between:

**Contract analysis / informational assistance**

and

**professional legal advice.**

---

## 12. Chatbot

The contract chatbot must answer questions using the relevant uploaded contract context.

Recommended flow:

```text
User Question
      ↓
Authenticated User
      ↓
Identify Contract
      ↓
Retrieve Contract Context
      ↓
Build AI Prompt
      ↓
AI Service
      ↓
Validate Response
      ↓
Return Answer
```

The chatbot must not access contracts belonging to another user.

When possible, answers should be grounded in the uploaded contract rather than general assumptions.

If the answer cannot be determined from the contract, the system should clearly state that the information is not available in the provided document instead of inventing an answer.

---

## 13. API Design

Use RESTful API conventions.

Examples:

```text
POST   /api/auth/login
POST   /api/auth/register

POST   /api/contracts
GET    /api/contracts
GET    /api/contracts/:id
DELETE /api/contracts/:id

POST   /api/contracts/:id/analyze
GET    /api/contracts/:id/analysis

POST   /api/contracts/:id/chat
GET    /api/contracts/:id/chat
```

Follow the existing project's actual route naming if these endpoints already exist.

Do not introduce duplicate endpoints.

Use appropriate HTTP status codes:

* `200` — Successful request.
* `201` — Resource created.
* `400` — Invalid request.
* `401` — Unauthenticated.
* `403` — Forbidden.
* `404` — Resource not found.
* `409` — Conflict.
* `422` — Validation failure where appropriate.
* `500` — Unexpected server error.

---

## 14. Validation

Validate:

* Request body.
* Query parameters.
* Route parameters.
* Uploaded files.
* Required fields.
* IDs before database operations.

Never rely only on frontend validation.

Backend validation is mandatory for security and data integrity.

---

## 15. Error Handling

Use consistent error responses.

Example:

```javascript
return response.status(400).json({
    message: 'Invalid contract data'
});
```

Do not expose:

* Stack traces.
* Database credentials.
* API keys.
* JWT secrets.
* Internal file paths.
* Sensitive implementation details.

Log detailed errors on the server when appropriate.

Return safe messages to clients.

---

## 16. Environment Variables

Never hardcode secrets.

Sensitive configuration must use environment variables.

Examples:

```text
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
```

Never commit:

```text
.env
```

or any file containing real credentials.

If a new environment variable is required:

1. Explain why it is required.
2. Identify where it will be used.
3. Get approval before modifying configuration.

---

## 17. Swagger / OpenAPI

**Always create or update Swagger documentation for every newly added API.**

For every new endpoint document:

* HTTP method.
* Endpoint path.
* Description.
* Authentication requirements.
* Request parameters.
* Request body.
* Response schema.
* Success responses.
* Error responses.

If a new model is introduced for an API response or request, add the corresponding Swagger schema.

Swagger documentation must remain synchronized with the actual API behavior.

---

## 18. Database Operations

All MongoDB interactions must go through DAO functions.

Do not write direct Mongoose queries inside controllers.

Bad:

```javascript
const contract = await Contract.findById(request.params.id);
```

inside a controller.

Preferred:

```javascript
const contract = await contractDao.findById(request.params.id);
```

DAO functions should remain focused and reusable.

---

## 19. Security

Because this application processes potentially sensitive legal documents:

* Never log full contract contents unnecessarily.
* Never log API keys or authentication tokens.
* Validate uploaded files.
* Restrict file types and sizes.
* Protect contract ownership.
* Sanitize user-controlled input.
* Avoid exposing internal errors.
* Keep secrets outside source code.
* Do not unnecessarily retain sensitive document data.

AI prompts should not include unrelated user information.

---

## 20. Frontend API Usage

React components should not contain backend business logic.

Prefer:

```text
React Component
      ↓
API / Service Layer
      ↓
Express Route
      ↓
Controller
      ↓
Service
      ↓
DAO
```

Keep API calls reusable and centralized where the existing frontend architecture supports it.

Handle:

* Loading states.
* API errors.
* Empty states.
* Authentication failures.
* Upload progress where applicable.
* AI processing states.

---

## 21. Coding Style

Follow the existing project's coding style.

Prefer:

* `async/await`.
* Clear variable names.
* Small focused functions.
* Reusable services.
* Consistent error handling.
* Consistent response structures.
* Existing project conventions.

Avoid:

* Unnecessary abstractions.
* Duplicate code.
* Giant controller functions.
* Business logic inside routes.
* Database queries inside controllers.
* Hardcoded secrets.
* Unnecessary dependencies.
* Large unrelated refactors.

---

## 22. Backward Compatibility

When modifying existing functionality:

1. Check all usages of the affected function/API/model.
2. Preserve existing behavior unless the change explicitly requires otherwise.
3. Avoid breaking existing frontend API calls.
4. Consider existing MongoDB documents.
5. Update Swagger documentation when the API changes.

Do not rename or remove existing API fields without approval.

---

## 23. Testing

Before considering a backend change complete, verify:

* Successful request.
* Invalid request.
* Unauthorized request.
* Resource-not-found case.
* Database failure where relevant.
* AI failure where relevant.
* Invalid or corrupted document where relevant.
* Ownership/access control.

For contract analysis features, test with different document types, including:

* Employment offer letters.
* Employment agreements.
* Rental agreements.
* NDAs.
* Service agreements.
* Freelance agreements.
* Terms and conditions.
* Contracts containing important deadlines.
* Contracts with potentially risky clauses.
* Scanned/image-based PDFs where OCR is supported.

---

## 24. Change Workflow

For every requested feature:

### Step 1 — Inspect

Understand the existing implementation before changing anything.

### Step 2 — Plan

Identify:

* Files to modify.
* Files to create.
* APIs affected.
* Models affected.
* Dependencies required.
* Database impact.

### Step 3 — Ask for Approval

Present the proposed changes to the user.

**Do not modify the project before receiving approval.**

### Step 4 — Implement

Make only the approved changes.

### Step 5 — Validate

Check for:

* Syntax errors.
* Broken imports.
* API inconsistencies.
* Authentication issues.
* Database issues.
* AI integration issues.

### Step 6 — Document

Update Swagger/OpenAPI for every new or changed API.

### Step 7 — Report

After implementation, summarize:

* Files changed.
* What was implemented.
* APIs added/changed.
* Dependencies added.
* Tests/checks performed.
* Any remaining issues.

---

## 25. Important Rule

**Do not make assumptions about the existing implementation.**

If the requested change conflicts with the current architecture, existing API behavior, database schema, or authentication flow:

1. Explain the conflict.
2. Propose the safest approach.
3. Ask for approval.
4. Only then make the change.

The priority is:

**Correctness → Security → Existing Architecture → Maintainability → Minimal Changes**

Never sacrifice security or data integrity merely to make an implementation faster.
