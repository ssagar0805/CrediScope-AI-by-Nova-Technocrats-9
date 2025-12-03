# CrediScope – AI-Powered Misinformation Detection Platform

> **Combat fake news with multi-modal verification & media literacy.** An AI-powered tool for India built with React, FastAPI, and Google Cloud.

---

## 🎯 Problem Statement

Misinformation spreads rapidly across social media, messaging apps, and news platforms in India, threatening public health, eroding institutional trust, and polarizing communities. Citizens lack accessible, trustworthy tools to verify claims quickly or understand the psychological, political, and technical manipulation techniques behind misleading content.

---

## 💡 Solution: CrediScope

**CrediScope** is an AI-powered, multi-modal verification assistant designed specifically for the Indian information landscape. It analyzes **text claims**, **URLs**, and **images** using Google Gemini and integrates real fact-checking sources to deliver verdicts alongside educational media literacy guidance.

### What It Does

1. **Multi-Modal Input**: Users submit claims, links, or images.
2. **Multi-Lens Intelligence**: The backend runs analysis through **political, financial, psychological, scientific, technical, and geopolitical lenses**.
3. **Structured Verdict**: Returns confidence score, quick summary, fact-check sources, and a step-by-step education checklist.
4. **Media Literacy First**: Every result includes an "Explain like I'm 12" summary and teaches users how to verify similar content themselves.

---

## ✨ Key Features

### 🔍 Multi-Modal Verification
- **Text Analysis** – Analyze standalone claims
- **URL Analysis** – Fetch and verify article links with Safe Browsing checks
- **Image Analysis** – OCR + text extraction with Google Vision, then analyze extracted content

### 🧠 Multi-Lens Intelligence Briefing
Political, financial, psychological, scientific, technical, and geopolitical perspectives tailored to Indian institutional and democratic context.

### 🔗 Real Fact-Checking Integration
- **Google Fact Check Tools API** – Professional fact-checker sources
- **Perspective API** – Toxicity and manipulation detection
- **Google Safe Browsing API** – Malicious URL flagging
- **Gemini (Google Generative AI)** – Deep contextual reasoning and explanation

### 🇮🇳 India-Focused Design
- References Indian institutions (Election Commission, ICMR, Health Ministry, etc.)
- Tailored checklists for medical, political, tech, and general claims
- **Hindi translation support** via Google Translate API

### 📚 Educational UX
- "Explain like I'm 12" summaries
- Interactive **education checklist** teaching fact-checking techniques
- Claim classification (medical, political, technology, general)
- Language-aware formatting

### 🛠️ Developer-Friendly APIs
- RESTful FastAPI with Swagger UI (`/docs`) and ReDoc (`/redoc`)
- Health & readiness endpoints for production monitoring
- JSON-based analysis history (MVP; upgradeable to Firestore/Cloud SQL)

---

## 🏗️ Architecture Overview

### Frontend: React + Vite + TypeScript
**Location:** `frontend/`

- **Stack:** React 18, TypeScript, Vite, React Router
- **UI Components:** shadcn-ui (Radix), Tailwind CSS, Framer Motion animations
- **Pages:** Index (HeroSection), Results, ImageResults, Archive, Authority, Learn, Explain
- **API Client:** Custom client (`src/api/client.ts`) supporting REST + streaming

**Key Routes:**
```
POST /api/v1/analyze          → Text analysis
POST /analyze/image           → Image analysis  
GET  /results?id=text:...     → Display verdict & insights
GET  /image-results           → Image analysis results
```

### Backend: FastAPI + Google Cloud Services
**Location:** `backend/`

- **Core:** FastAPI (Uvicorn), Pydantic v2 models
- **Main Entrypoint:** `app/main.py` with CORS, health endpoints, `/api/v1/analyze`
- **Analysis Engine:** `app/services/analysis_engine.py` orchestrates all verification steps
- **Result Structure:** Verdict, confidence, evidence grid, multi-lens intelligence, education checklist, audit trail

**Key Endpoints:**
```
POST /api/v1/analyze           → Universal endpoint (text, URL, image)
POST /analyze/text             → Text-specific
POST /analyze/url              → URL + Safe Browsing
POST /analyze/image            → Image OCR + analysis
GET  /api/v1/health            → Health check
GET  /docs                      → Swagger UI
```

### Google Cloud & External Services
- **Gemini (google-generativeai)** – Deep reasoning, explanations, multi-lens narratives
- **Fact Check Tools API** – Professional fact-check aggregation
- **Perspective API** – Toxicity/manipulation scoring
- **Cloud Vision API** – OCR for images
- **Cloud Translation API** – Hindi + language detection
- **Safe Browsing API** – URL threat detection
- **Cloud AI Platform** – Future ML expansion

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, React Router, TanStack Query |
| **Styling** | Tailwind CSS, shadcn-ui (Radix UI), Framer Motion |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **AI/ML** | Google Gemini, Fact Check Tools, Perspective API, Vision API, Translate API |
| **Cloud** | Google Cloud Platform (Vision, Translation, Safe Browsing) |
| **Dev Tools** | pytest, ESLint, TypeScript, Vite config, Dockerfile |
| **Database** | Local JSON files (MVP) → Firestore/Cloud SQL (production) |

---

## 📋 Prerequisites

### General
- Git
- Modern browser (Chrome, Firefox, Edge)

### Frontend
- **Node.js 18+** (npm or compatible package manager)

### Backend
- **Python 3.10+** (3.11 recommended)
- `pip` package manager
- Virtual environment tool (`venv` or `virtualenv`)

### Google Cloud Setup
A Google Cloud project with the following **enabled**:
- ✅ Generative Language API (Gemini access)
- ✅ Fact Check Tools API
- ✅ Perspective API
- ✅ Cloud Vision API
- ✅ Cloud Translation API
- ✅ Safe Browsing API

**Required credentials:**
- API keys (for REST-based services)
- Service account JSON (for gRPC services)
- OAuth client credentials (for authenticated flows)

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/crediscope-ai.git
cd crediscope-ai
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
```

#### Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in `backend/`:

```dotenv
# ============ SERVER CONFIG ============
PORT=8080
DEBUG=true
SKIP_AUTH=true
FRONTEND_ORIGIN=http://localhost:5173

# ============ GOOGLE CLOUD APIs ============
GENAI_API_KEY=your_gemini_api_key_here
FACT_CHECK_API_KEY=your_fact_check_api_key_here
PERSPECTIVE_API_KEY=your_perspective_api_key_here
VISION_API_KEY=your_vision_api_key_here
TRANSLATION_API_KEY=your_translation_api_key_here
SAFE_BROWSING_API_KEY=your_safe_browsing_api_key_here
GOOGLE_PROJECT_ID=your-gcp-project-id

# ============ OPTIONAL: CREDENTIALS FILES ============
GOOGLE_CLIENT_SECRET_FILE=./client_secret.json
GOOGLE_TOKEN_FILE=./token.json
```

**Security:** Never commit `.env` or credential JSON files. Add to `.gitignore`:
```
.env
*.json
client_secret.json
crediscopemain.json
```

#### Run Backend

**Option A: Using helper script**
```bash
python run.py
```

**Option B: Using Uvicorn directly**
```bash
uvicorn app.main:app --port 8000 --reload

```

**Backend will be available at:**
- 🔗 API: `http://localhost:8080`
- 📖 Swagger UI: `http://localhost:8080/docs`
- 📚 ReDoc: `http://localhost:8080/redoc`
- ❤️ Health: `http://localhost:8080/health`

### 3. Frontend Setup (React + Vite)

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

Create `.env.local` in `frontend/`:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

#### Run Development Server

```bash
npm run dev
```

**Frontend will be available at:**
- 🌐 App: `http://localhost:5173`

---

## 🎮 Running the Full Application

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
python run.py
# ✅ Wait for: "Uvicorn running on http://0.0.0.0:8080"
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# ✅ Wait for: "Local: http://localhost:5173"
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5173**

### Step 4: User Flow

#### 📝 Text Claim Analysis
1. On home page, select **Text** tab
2. Enter a claim (e.g., "COVID-19 vaccines contain 5G microchips")
3. Click **"Analyze Claim"**
4. View results: verdict, confidence, evidence sources, education checklist

#### 🔗 URL Analysis
1. Select **URL** tab
2. Paste an article link
3. Click **"Analyze URL"**
4. System checks for misinformation + malicious links

#### 🖼️ Image Analysis
1. Select **Image** tab
2. Upload screenshot/image
3. System performs OCR + analyzes extracted text
4. View results with sources

---

## ⚙️ Configuration Reference

### Backend Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | HTTP server port | `8080` |
| `DEBUG` | Enable debug mode & auto-reload | `true` / `false` |
| `SKIP_AUTH` | Bypass authentication (dev only) | `true` |
| `FRONTEND_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `GENAI_API_KEY` | Gemini API key | `AIz...` |
| `GOOGLE_PROJECT_ID` | GCP project ID | `my-project-123` |

### Frontend Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |

**Tip:** For production, update `VITE_API_BASE_URL` to your deployed backend (e.g., `https://api.crediscope.app`).

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
# Ensure venv is activated
pytest
```

**Test files:**
- `test_mcp_server.py` – MCP integration tests
- `test_real_apis.py` – Real Google API integration tests

**Note:** Some tests require valid API keys and network access.

### Frontend Linting

```bash
cd frontend
npm run lint
```

---

## 📁 Project Structure

```
crediscope-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models.py
│   │   ├── services/
│   │   │   ├── analysis_engine.py
│   │   │   ├── gemini_service.py
│   │   │   ├── factcheck_service.py
│   │   │   ├── perspective_service.py
│   │   │   ├── vision_service.py
│   │   │   └── translation_service.py
│   │   └── routes/
│   ├── storage/
│   ├── requirements.txt
│   ├── run.py
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/client.ts
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.local
│
├── .gitignore
├── README.md
└── project_tree.txt
```

---

## 🔐 Security & Best Practices

### Secrets Management
- ❌ **Never** commit `.env`, `*.json` credential files
- ✅ Use environment variables in `.env` (local) and GCP Secret Manager (production)
- ✅ Rotate API keys regularly
- ✅ Use service account credentials with minimal IAM permissions

### API Security
- ✅ CORS configured to trusted origins only
- ✅ Rate limiting recommended for production
- ✅ Input validation on all endpoints (Pydantic models)
- ✅ Error handling doesn't leak sensitive information

### Frontend Security
- ✅ `textContent` used instead of `innerHTML` to prevent XSS
- ✅ External links have `rel="noopener noreferrer"`
- ✅ No sensitive data stored in local storage

---

## 🚢 Deployment

### Deploy Backend to Google Cloud Run

```bash
cd backend

# Build Docker image
docker build -t crediscope-backend:latest .

# Tag for Google Container Registry (GCR)
docker tag crediscope-backend:latest gcr.io/YOUR-PROJECT-ID/crediscope-backend:latest

# Push to GCR
docker push gcr.io/YOUR-PROJECT-ID/crediscope-backend:latest

# Deploy to Cloud Run
gcloud run deploy crediscope-backend \
  --image gcr.io/YOUR-PROJECT-ID/crediscope-backend:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars GENAI_API_KEY=xxx,FACT_CHECK_API_KEY=yyy,...
```

### Deploy Frontend to Vercel / Netlify / Firebase Hosting

**Vercel:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Build for production:**
```bash
npm run build
# Creates dist/ folder
```

After deployment, update `VITE_API_BASE_URL` in frontend `.env` to point to deployed backend.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m "Add your feature"`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Code Style
- Backend: Follow PEP 8, use `black` for formatting
- Frontend: Use ESLint, TypeScript strict mode

---

## 🎓 Learning & Resources

### For Developers Diving Into the Code

- **[Google Gemini Documentation](https://ai.google.dev/)** – LLM integration
- **[FastAPI Docs](https://fastapi.tiangolo.com/)** – Backend framework
- **[React Documentation](https://react.dev/)** – Frontend framework
- **[Vite Guide](https://vitejs.dev/)** – Build tool & dev server

### For Misinformation Research

- **[Google Fact Check Tools](https://toolbox.google.com/factcheck/)** – Fact-checking aggregator
- **[Perspective API](https://www.perspectiveapi.com/)** – Toxicity detection
- **[Media Literacy Resources](https://newsmaven.io/)** – How to identify fake news

---

## ⚠️ Limitations & Future Work

### Current Limitations

1. **API Dependency**
   - Heavy reliance on Google Cloud APIs (Gemini, Fact Check, Vision, etc.)
   - Subject to quota limits and pricing
   - Graceful degradation implemented, but UX depends on availability

2. **Storage (MVP)**
   - Currently uses local JSON files in `backend/storage/`
   - Production should migrate to **Firestore** or **Cloud SQL** for scalability

3. **Authentication**
   - `SKIP_AUTH=true` by default (development mode)
   - No user profiles, saved histories, or role-based access yet

4. **Language Coverage**
   - Hindi translation supported; other Indian languages (Tamil, Telugu, Kannada, etc.) require additional work

5. **Bias & Explainability**
   - Gemini and fact-checking APIs may contain inherent biases
   - Future work: model evaluation, bias mitigation, clearer user disclaimers

### Roadmap

- [ ] User authentication & personalized history
- [ ] Database upgrade (Firestore or Cloud SQL)
- [ ] Multi-language support (Tamil, Telugu, Kannada, Bengali)
- [ ] Advanced streaming for real-time feedback
- [ ] Fact-checker collaboration tools
- [ ] Mobile app (React Native)
- [ ] Bias auditing & mitigation dashboard
- [ ] Community annotations layer

---

## 📄 License

This project is released under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Cloud** – Hosting, APIs (Gemini, Vision, Translate, Fact Check Tools)
- **Google Hackathon** – Challenge & inspiration
- **shadcn-ui** – UI components
- **FastAPI Community** – Excellent documentation and support


---

## 📊 Status & Updates

- ✅ **Completed:** Multi-modal analysis, Google Cloud integration, fact-checking, UI
- 🔄 **In Progress:** Production database setup, advanced streaming
- 📋 **Planned:** Mobile app, multi-language support, bias auditing

**Last Updated:** December 2025

---
Built with React + FastAPI + Google Cloud.
