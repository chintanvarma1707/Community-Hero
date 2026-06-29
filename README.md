# 🦸 Community Hero

> A civic-tech platform empowering citizens to report, validate, and track local infrastructure issues in real-time.

![Community Hero](https://img.shields.io/badge/Google_Cloud-Powered-4285F4?style=for-the-badge&logo=google-cloud)
![Gemini AI](https://img.shields.io/badge/Gemini_Vision-AI_Powered-8B5CF6?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React_19-Frontend-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)

---

## 🌟 Features

| Feature | Description |
|---|---|
| 📸 **AI Issue Reporting** | Upload photo → Gemini Vision auto-categorizes & scores severity |
| 🗺️ **Live Map** | Google Maps with real-time issue pins, filters, and heatlayers |
| ✅ **Community Verification** | Citizens verify issues to confirm they're still present |
| 🏆 **Civic Leaderboard** | Points + badges for reporters and verifiers |
| 📊 **Impact Dashboard** | Heatmaps, status tracking, and predictive AI insights |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **Vite** — Component-based UI
- **Tailwind CSS v4** — Modern styling with glassmorphism
- **@vis.gl/react-google-maps** — Interactive maps
- **Zustand** — State management
- **Framer Motion** — Smooth animations

### Backend
- **FastAPI** (Python) — Async REST API
- **SQLModel** + **SQLite** — Zero-config local database
- **Google Gemini Vision API** — Image AI analysis
- **Uvicorn** — ASGI server

### Google Cloud (Deployment)
- **Firebase Hosting** / **Cloud Storage** — Frontend hosting
- **Cloud Run** — Containerized backend
- **Cloud SQL (PostgreSQL)** — Production database
- **Cloud Storage Buckets** — Image/video storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Google Maps API Key
- Google Gemini API Key

### 1. Clone & Setup

```bash
git clone <repo-url>
cd community-hero
```

### 2. Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API keys

npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 📁 Project Structure

```
community-hero/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── pages/           # Route pages
│   │   ├── components/      # Reusable UI components
│   │   └── store/           # Zustand state stores
│   └── package.json
├── backend/                  # FastAPI app
│   ├── app/
│   │   ├── models/          # SQLModel data models
│   │   ├── routers/         # API route handlers
│   │   ├── services/        # Business logic (Gemini, AI)
│   │   └── core/            # Database config
│   └── requirements.txt
└── README.md
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_maps_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=sqlite:///./community_hero.db
```

---

## 🧠 AI Integration

The platform uses **Google Gemini Vision API** to:
1. Analyze uploaded issue photos
2. Auto-classify into categories (Pothole, Streetlight, Water Leak, etc.)
3. Assign severity scores (Low / Medium / High) based on visual evidence
4. Generate predictive insights from historical patterns

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/issues` | Create new issue |
| `GET` | `/api/issues` | List all issues |
| `POST` | `/api/issues/{id}/verify` | Verify an issue |
| `PATCH` | `/api/issues/{id}/status` | Update issue status |
| `POST` | `/api/analysis/image` | AI image analysis |
| `GET` | `/api/dashboard/stats` | Aggregate statistics |
| `GET` | `/api/dashboard/heatmap` | Heatmap GeoJSON |
| `GET` | `/api/users/leaderboard` | Top contributors |

---

## 🏆 Gamification System

| Action | Points |
|---|---|
| Report a new issue | +10 pts |
| Issue gets verified | +5 pts |
| Verify another issue | +3 pts |
| Issue marked Resolved | +20 pts |

### Badges
- 🌱 **First Steps** — First report submitted
- 🔍 **Watchdog** — 10 verifications
- 🏗️ **City Builder** — 5 resolved issues
- ⭐ **Hero** — 500 points

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Google Cloud deployment guide.

---

## 📋 Hackathon Submission

- **Platform**: BlockseBlock
- **Problem Statement**: Local infrastructure gap between citizens and municipalities
- **Google Technologies**: Gemini Vision API, Google Maps API, Firebase Hosting, Cloud Run, Cloud SQL
