# Legal Aid — RAG Document Q&A (Work in Progress)

A retrieval-augmented generation (RAG) system for asking questions about uploaded legal documents, with a hand-written Express backend.

> **Status: in active development.** The document ingestion pipeline (upload → extract → chunk → store) and data model are complete; the embedding/retrieval phase is next. Some dev values are still hardcoded (e.g. the server port) and there is no automated test suite yet — see the [roadmap](#roadmap) below.

## Why this project

Most of my projects exist to learn a technology properly rather than lean on scaffolding. Here that means the API layer is written from scratch — routing, auth middleware, controllers, services, and error handling are all hand-built on Express rather than generated — and the data model for the full RAG flow was designed up front before any retrieval code was written.

## What's built so far

### Document ingestion pipeline

Upload → validate → store → extract → chunk, with document status tracked as a state machine:

```
uploaded → processing → ready
                      ↘ failed
```

- **File validation** — MIME-type allowlist (PDF / Word) before anything touches storage
- **Failure-safe by design** — every failure point flips the document's status to `failed`, so an async pipeline error never leaves a document stuck in limbo; if the storage upload fails after the database row is created, the row is rolled back so no orphaned records exist
- **PDF text extraction** via [unpdf](https://github.com/unjs/unpdf)
- **Chunking** — fixed-size word chunks stored with ordering metadata (`chunk_order`, `doc_order_number`, `chunk_condition`) so chunks can be reassembled in order and matched back into the source document for citations

### Hand-written Express backend

```
routes → requireAuth middleware → controller → services
                                      ↓
                             central errorHandler
```

- **JWT auth middleware** — parses the Bearer token and verifies it against Supabase auth; the authenticated user is attached to the request (typed via Express declaration merging)
- **Layered services** — upload and chunking are separate, individually testable services
- **Central error handler** wired as the last middleware

### Data model designed for RAG

The schema anticipates the retrieval phase: `chunks` and `questions` tables carry `vector(1536)` embedding columns for pgvector similarity search. Full table-by-table design — constraints, relationships, and the reasoning behind them (including why citations are done by chunk-text matching rather than PDF page anchoring) — is documented in [SCHEMA.md](SCHEMA.md).

### Supporting infrastructure

- **User storage cleanup** — a webhook-secret-gated Supabase edge function, driven by a jobs table, deletes all of a user's stored files and marks the job complete (machine-to-machine auth, not user JWTs)
- **CI on every pull request** — lint + typecheck + production build via GitHub Actions, with a protected `main` branch and feature-branch workflow ([CI_CD.md](CI_CD.md))

## Tech stack

- **Backend:** Express 5 + TypeScript, Multer (uploads), unpdf (PDF extraction)
- **Data & auth:** Supabase (PostgreSQL + pgvector, Auth, Storage, Edge Functions)
- **Frontend:** React 19, TypeScript, Vite, React Router
- **Process:** GitHub Actions CI, protected `main`, PR-based workflow

## Roadmap

Working through this in phases:

1. ~~Ingestion pipeline — upload, extraction, chunking, status tracking~~ ✅
2. **Embeddings** — generate and store chunk/question embeddings (pgvector)
3. **Retrieval + answering** — similarity search, prompt assembly, LLM answers with citations
4. **Hardening** — replace hardcoded dev values with config, automated tests, retrieval evaluation harness (recall / MRR)

Deferred ideas and design notes live in [FUTURE.md](FUTURE.md).

## Running locally

```bash
npm install
npm run server   # Express API (currently on port 3000)
npm run dev      # Vite frontend on http://localhost:5173
```

Requires a Supabase project and a `.env` with:

```bash
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"
```
