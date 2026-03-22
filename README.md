# VedaAI — AI Assessment Creator

An enterprise-grade, multi-tenant AI platform that allows teachers to seamlessly auto-generate structured question papers, quizzes, and rubrics using Gemini AI and a resilient background queue architecture.

---

## ✨ Full Feature Set

- **Intelligent Assignment Generation** — Upload context, select deadlines, and configure extremely precise questions per type (MCQs, Short Answer, Long Answer) using a clean, step-by-step UI.
- **Robust Multi-Tenancy & Data Isolation** — Strictly walled accounts where generated assessments and API routes are intrinsically bound to specific User IDs. Every teacher possesses an isolated workspace.
- **Flawless Responsive UI/UX** — Absolute pixel-perfect translation across Mobile and PC viewports. Custom responsive grids lock native layouts properly across Desktop architectures, while Mobile operates on dedicated full-blade floating navigational pills. 
- **Real-Time WebSocket Feedback** — Zero polling. Instant UI progression updates flowing from the Backend Redis Queue directly into the Frontend DOM (Pending → Processing → Extracting → Done) through secure Socket.io channels.
- **Deterministic AI Outputs** — Complete elimination of LLM hallucination text. The Gemini 1.5 Flash models are hard-bound to return structured, strictly parsed JSON interfaces natively consumable by the frontend database.
- **Automated PDF Export Engine** — Generates and downloads professionally formatted PDF papers using `@react-pdf/renderer` with rich tabular answer keys and explicit question difficulty metrics (Easy/Moderate/Hard).
- **Graceful Error Recovery** — Redis-backed retry logic safely catches unstable LLM network `ECONNRESET` exceptions, holds the job, and re-executes generation seamlessly.

---

## 🧠 Engineering Approach

The system was crafted focusing exclusively on stability, responsiveness, and resilient AI API consumption.

#### 1. Frontend State & Pipeline
* **Centralized State:** Built on `Zustand` to manage complex assessment pipelines and User Authentication globally without deep prop-drilling.
* **Aggressive DOM Debouncing:** Applied `150ms` debouncing layers against CSS Grid / Desktop Layout resizing calculations to permanently remove standard Next.js dev server lag hooks on weaker processing machines.
* **Component Level Separation:** Implemented granular split routing logic for `Sidebar`, `Topbar`, and `MobileLayout` to cleanly sever dependencies and independently manage mobile Drawer states vs. PC navigation trees.

#### 2. Backend Architecture
* **Decoupled API vs Workers:** Standard Express routes handle immediate validations and MongoDB fetching, but the heavy LLM API overhead is forcefully outsourced to a `BullMQ` + `Redis` worker queue. 
* **TCP Keep-Alives:** Modified raw Node `tls` options and Axios interceptors handling API generation routes to endure extended 15-second multi-payload generation spans without abruptly closing connections.
* **Database Neutrality:** Employed MongoDB `+srv` DNS SRV mechanisms combined with dynamic Dual-Stack (IPv4 / IPv6) auto-negotiation, completely circumventing strict Campus/Corporate Firewall port 27017 drops.

---

## 🏗️ Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 15)                  │
│  Zustand Store ──► React Components ──► Socket.io Client    │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP + WebSocket
┌─────────────────────────▼───────────────────────────────────┐
│                    BACKEND (Express + TS)                   │
│  REST API ──► BullMQ Queue ──► Worker ──► Google Gemini API │
│      │                                        │             │
│   MongoDB                                  Redis            │
│  (Assignments,                          (Job queuing,       │
│    Results)                              caching)           │
└─────────────────────────────────────────────────────────────┘
```

1. **Dispatch:** Teacher forms configure generation schema → `POST /api/assignments`
2. **Buffer:** Assessment object pushed to MongoDB (pending status).
3. **Queue:** Worker process securely isolates job in BullMQ node.
4. **Execution:** Active `assessmentWorker.ts` pulls Gemini 1.5 payload → Extrapolates strictly typed JSON structure.
5. **Broadcast:** MongoDB result patched → `socket.io` broadcast emitted to isolated User Room triggering a real-time progress bar.

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Upstash Redis account
- Google AI Studio API key

### 1. Clone & Install

```bash
# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Environment Configuration

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<USER>:<PASS>@<CLUSTER>/?retryWrites=true&w=majority
REDIS_URL=rediss://default:<PASS>@<UPSTASH>.upstash.io:6379
GEMINI_API_KEY=AIzaSy...
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

### 3. Run the Stack Locally

Open **3 independent terminals**:

```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Background AI Worker
cd backend && npm run worker

# Terminal 3 — Frontend Application
cd frontend && npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000)

---

## 📦 Tech Stack

| Layer      | Technology                          | Focus / Role                            |
|------------|-------------------------------------|-----------------------------------------|
| **Frontend**| Next.js App Router, React, Tailwind| Server-Side layout efficiency           |
| **State**  | Zustand                             | Store hydration & isolated cache clears |
| **Forms**  | React Hook Form + Zod               | Safe data structuring                   |
| **WebSockets**| Socket.io client                 | Real-time pipeline statuses             |
| **Backend**| Node.js, Express, TypeScript        | Non-blocking asynchronous IO            |
| **Database**| MongoDB Atlas + Mongoose           | Document-oriented assignment mappings   |
| **Queue**  | Upstash Redis + BullMQ              | Retrying / Scaling LLM jobs             |
| **AI Layer**| Google Gemini 1.5 Flash API        | Deep token parsing & structure          |
| **Export** | @react-pdf/renderer                 | Clean layout rendering mapping          |