# AI Research Assistant

A production-style AI-powered research assistant built with modern LLM engineering architecture using FastAPI, Next.js, LangChain, ChromaDB, Gemini, and PostgreSQL.

This application supports:
- AI chat
- Retrieval-Augmented Generation (RAG)
- PDF document analysis
- Persistent chat memory
- Streaming responses
- Session-based conversations
- Authentication system
- Source citations
- Multi-document retrieval

---

# Features

## AI Chat
- Real-time streaming AI responses
- Persistent chat sessions
- Conversation memory
- Session switching
- Chat history restoration

## RAG Pipeline
- Upload and analyze PDFs
- Multi-document retrieval
- Semantic search using embeddings
- Source citation rendering
- Context-aware responses

## Authentication
- JWT authentication
- Secure HTTP-only cookies
- Signup/Login system
- Protected API routes

## Frontend
- Modern chat UI
- Sidebar conversation history
- Streaming typing effect
- Session management
- Loading states
- Responsive layout

## Backend
- REST API architecture
- Streaming endpoints
- PostgreSQL persistence
- Session-based chat architecture
- Modular service structure

---

# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

## Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic

## AI Stack
- LangChain
- Gemini 1.5 Flash
- Gemini Embeddings
- ChromaDB

## Database
- PostgreSQL
- Neon PostgreSQL

## Deployment
- Railway
- Vercel

---

# Architecture

```txt
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
LangChain Services
        ↓
Gemini API + ChromaDB
        ↓
PostgreSQL Database
```

---

# Project Structure

```txt
project-root/
│
├── backend/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── rag/
│   ├── services/
│   ├── main.py
│   └── pyproject.toml
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
└── README.md
```

---

# Core Features Breakdown

## 1. AI Chat System
The application supports persistent AI conversations with:
- session tracking
- conversation history
- streaming token responses
- memory-aware context handling

---

## 2. RAG (Retrieval-Augmented Generation)
Users can upload PDFs which are:
1. parsed
2. chunked
3. embedded
4. stored in ChromaDB

Relevant chunks are retrieved during user queries and injected into the LLM context.

---

## 3. Session-Based Architecture
Each conversation is stored using:
- unique session IDs
- persistent message history
- database-backed chat restoration

This enables:
- continuing old conversations
- restoring previous chats
- switching between sessions

---

## 4. Streaming Responses
The backend streams AI responses token-by-token for real-time UX similar to modern AI applications.

---

# Environment Variables

## Backend `.env`

```env
DATABASE_URL=your_postgres_url

GOOGLE_API_KEY=your_gemini_api_key

SECRET_KEY=your_secret_key

FRONTEND_URL=http://localhost:3000
```

---

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

# Installation

# Backend Setup

## 1. Navigate to backend

```bash
cd backend
```

## 2. Install dependencies

Using uv:

```bash
uv sync
```

## 3. Start backend server

```bash
uv run uvicorn main:app --reload
```

Backend runs on:

```txt
http://localhost:8000
```

---

# Frontend Setup

## 1. Navigate to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# API Endpoints

## Authentication

```txt
POST /signup
POST /login
GET  /me
POST /logout
```

---

## Chat

```txt
POST /chat
GET  /sessions
POST /sessions
GET  /sessions/{session_id}/messages
```

---

## PDF Upload

```txt
POST /upload-pdf
```

---

# Database Models

## Users
Stores:
- user accounts
- authentication data

## Chat Sessions
Stores:
- session IDs
- chat titles
- user ownership

## Messages
Stores:
- conversation history
- AI responses
- role metadata

---

# Future Improvements

## Planned Features
- AI agents
- Tool calling
- Web search integration
- LangGraph workflows
- Redis caching
- Docker support
- Rate limiting
- Markdown rendering
- OAuth login
- Production observability

---

# Deployment

## Frontend
Deploy on:
- Vercel

## Backend
Deploy on:
- Railway

## Database
Hosted on:
- Neon PostgreSQL

---

# Why This Project Matters

This project demonstrates practical AI engineering concepts including:
- LLM integration
- RAG systems
- vector databases
- streaming architectures
- authentication
- backend engineering
- cloud-ready architecture
- production-style SaaS patterns

---

# Author

Vijay Shankar

Built as part of a deep learning journey into:
- AI Engineering
- Generative AI
- RAG Systems
- LLM Applications
- Full Stack Development

---

# License

MIT License