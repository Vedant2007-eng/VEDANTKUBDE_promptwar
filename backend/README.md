# BlindSpot AI — Backend Engine

> "Think deeper. Decide better."

BlindSpot AI is an AI-powered thinking companion that analyzes human reasoning across **15 distinct cognitive perspectives**, surfaces unexamined blind spots, challenges implicit assumptions, and guides reflective self-inquiry without ever making the decision for the user.

---

## 🏗 Architecture Overview

```
Frontend (Next.js)
       ↓  POST /api/analysis/start
FastAPI Analysis Gateway
       ↓
Agent Orchestrator (Controlled concurrency semaphore: 3-5)
       ↓
15 Specialized Agents (Goal, Requirements, Cost, Benefits, Risks, Uncertainty,
                      Assumptions, Evidence, Alternatives, Time Horizon, Trade-offs,
                      Stakeholders, Cognitive Biases, Reversibility, Opportunity Cost)
       ↓
Synthesis Agent (Deduplication, contradiction detection, blind spot ranking, key questions)
       ↓  GET /api/analysis/{id} (Results Page)
User Reflection (4 Inquiries)
       ↓  POST /api/reflections
Reflection Agent (Synthesizes answers, updated perspective, reflection coverage)
       ↓  GET /api/analysis/{id}/report
100% Empowered Human Decision
```

---

## 🛠 Tech Stack

- **Framework**: Python 3.12 + FastAPI + Uvicorn
- **Data Validation**: Pydantic v2
- **Database**: MongoDB (Motor / PyMongo) with resilient automatic in-memory fallback
- **LLM Provider**: Groq Cloud API (`llama-3.3-70b-versatile` or custom model) via provider abstraction
- **HTTP Client**: HTTPX (async)
- **Testing**: Pytest + Pytest-AsyncIO

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── agents/                     # 15 perspective agents + Synthesis & Reflection agents
│   │   ├── base_agent.py
│   │   ├── specialized_agents.py   # Goal, Risks, Assumptions, Evidence, etc.
│   │   ├── synthesis_agent.py
│   │   └── reflection_agent.py
│   ├── api/
│   │   └── routes/                 # REST API endpoints
│   │       ├── health.py
│   │       ├── analysis.py
│   │       ├── decisions.py
│   │       ├── reflections.py
│   │       └── reports.py
│   ├── core/                       # Config, security, logging
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   ├── db/                         # MongoDB & in-memory database layer
│   │   ├── mongodb.py
│   │   └── repositories/           # Repositories for decisions, analyses, reflections
│   ├── llm/                        # BaseLLMProvider & GroqProvider abstraction
│   │   ├── base_provider.py
│   │   └── groq_provider.py
│   ├── models/ & schemas/          # Strict Pydantic models
│   ├── services/                   # Business logic & background orchestrator
│   │   ├── agent_orchestrator.py
│   │   ├── analysis_service.py
│   │   ├── synthesis_service.py
│   │   ├── reflection_service.py
│   │   └── report_service.py
│   ├── utils/                      # System prompts & validators
│   │   └── prompts.py
│   └── main.py                     # FastAPI entrypoint
├── tests/                          # Automated test suite
├── .env.example
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## 🚀 Setup & Execution

### 1. Virtual Environment & Dependencies

```bash
# Create virtual environment
python -m venv .venv

# Activate on Windows
.venv\Scripts\activate

# Activate on Linux/macOS
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=blindspot_db
FRONTEND_URL=http://localhost:3000
MAX_CONCURRENT_AGENTS=5
LLM_MODEL=llama-3.3-70b-versatile
LLM_TIMEOUT=30
ENVIRONMENT=development
PORT=8000
```

> **Note**: If `GROQ_API_KEY` is omitted, the backend automatically uses its high-quality structured heuristic engine so you can test the full UI/UX flow offline.

### 3. Run the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

- API Base: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

---

## 🧪 Running Tests

```bash
pytest -v
```

All 15 agents, orchestrator concurrency, synthesis deduplication, and reflection pipelines are tested automatically without consuming real API credits.

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and database status |
| `POST` | `/api/analysis/start` | Initiates 15-agent perspective analysis |
| `GET` | `/api/analysis/{id}/status` | Live polling for agent progress (0-100%) |
| `GET` | `/api/analysis/{id}` | Complete analysis results, blind spots, and questions |
| `GET` | `/api/analysis/{id}/agents` | Structured outputs from all 15 agents |
| `GET` | `/api/analysis/{id}/blind-spots` | Ranked top blind spots |
| `POST` | `/api/reflections` | Submit reflection answers & trigger final synthesis |
| `GET` | `/api/reports/{id}` | Structured decision report for export |
| `GET` | `/api/decisions` | Historical decision list |
| `DELETE` | `/api/decisions/{id}` | Delete a decision |

---

## 🔒 Ethical AI Constraint

BlindSpot AI is built on a strict **non-coercive thinking companion principle**:
- The AI never says *"Invest"*, *"Do not invest"*, *"Accept this"*, or *"Reject that"*.
- The AI uses exploratory language: *"You may want to examine..."*, *"One unverified assumption appears to be..."*.
- **The final decision always belongs 100% to the user.**
