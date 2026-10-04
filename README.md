# BLINDSPOT AI

> **"Think deeper. Decide better."**

BlindSpot AI is an AI-powered thinking companion that reveals what people overlook when making critical decisions. It analyzes human reasoning across **15 distinct cognitive perspectives**, surfaces unexamined blind spots, challenges implicit assumptions, identifies unhedged downside risks, and guides deep self-reflection — **without ever making the decision for the user**.

---

## 🏛 System Architecture

```
BlindSpot/
├── src/                    # Next.js 16 + React 19 + TypeScript + Tailwind CSS Frontend
│   ├── app/                # App Router (5-screen flow: /, /analyze, /results, /reflection, /final)
│   ├── components/         # Modular UI, Layout, Decision, Analysis, & Reflection components
│   ├── context/            # React Context state management & localStorage persistence
│   ├── lib/                # API client with live polling & fallback resilience
│   └── types/              # Strict TypeScript interfaces
│
├── backend/                # FastAPI + Pydantic v2 + MongoDB + Groq AI Backend
│   ├── app/
│   │   ├── agents/         # 15 Specialized Thinking Agents + Synthesis & Reflection Agents
│   │   ├── api/routes/     # REST API routes (health, analysis, decisions, reflections, reports)
│   │   ├── core/           # Configuration, security sanitization, structured logging
│   │   ├── db/             # MongoDB (Motor) connection & in-memory fallback store
│   │   ├── llm/            # BaseLLMProvider & GroqProvider abstraction
│   │   ├── schemas/        # Strict Pydantic request/response models
│   │   └── services/       # Multi-agent orchestrator & background execution
│   ├── tests/              # Pytest test suite (100% pass)
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🔄 Core Product Flow

```
1. User Input (/)
       ↓ Stated decision & initial reasoning
2. AI Analysis (/analyze)
       ↓ 15 Specialized Agents examine reasoning in parallel
3. Results Dashboard (/results)
       ↓ Top Blind Spots, 15 Perspectives, Metrics, Key Questions
4. User Reflection (/reflection)
       ↓ 4 Guided inquiries with 0/500 character counters
5. Final Decision Map (/final)
       ↓ Reflection Coverage, 4 Key Insights, Updated Perspective, Report Export
Empowered Human Decision (100% User Agency)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+ / 24+
- Python 3.12+
- MongoDB (optional, automatic in-memory fallback included)

---

### Step 1: Start the Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run FastAPI backend (port 8000)
uvicorn app.main:app --reload --port 8000
```

- API Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/health`

---

### Step 2: Start the Frontend

```bash
# In the root project directory:
npm install
npm run dev
```

- Web App: `http://localhost:3000`

---

## 🧠 The 15 Cognitive Perspectives

1. **Goal**: Clarifies core motives, secondary objectives, and unstated definitions of success.
2. **Requirements**: Audits prerequisite conditions, mandatory criteria, constraints, and budgets.
3. **Cost / Resources**: Quantifies capital, cognitive bandwidth, time, and recurring commitments.
4. **Benefits / Expected Value**: Dissects realistic upside payoff vs wishful thinking.
5. **Risks**: Uncovers downside scenarios, failure modes, external shocks, and vulnerabilities.
6. **Uncertainty**: Distinguishes known facts from volatile variables beyond direct control.
7. **Assumptions**: Surfaces foundational beliefs treated as facts without active verification.
8. **Evidence**: Audits the validity, recency, and sample size of data behind the thesis.
9. **Alternatives**: Explores unconsidered hybrid paths, phased trials, and competing options.
10. **Time Horizon**: Aligns short-term emotional impulses with compound 3-to-5 year trajectory.
11. **Trade-offs**: Clarifies what is sacrificed (flexibility, safety, time) in exchange for the upside.
12. **Stakeholders**: Considers ripple effects on family, team members, and dependent parties.
13. **Cognitive Biases**: Detects recency bias, confirmation bias, sunk-cost fallacy, and FOMO.
14. **Reversibility**: Distinguishes one-way from two-way doors and analyzes exit friction.
15. **Opportunity Cost**: Identifies alternative high-conviction pursuits forfeited by committing.

---

## 🔒 Ethical AI Guarantee

- **No Automated Coercion**: The AI never says *"Invest"*, *"Do not invest"*, *"Accept the job"*, or *"Do this"*.
- **Thinking Companion**: Uses exploratory inquiry (*"You may want to examine..."*, *"One unverified assumption appears to be..."*).
- **Human Sovereignty**: The user always makes the final decision.
