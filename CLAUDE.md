# CLAUDE.md - Assistant Memorial Edition

## Project Overview

This is the **Assistant Memorial Edition** - a sophisticated AI coding assistant with an innovative Organizational Persona System that models the AI assistant as a cognitive entity with memory, skills, and embodied awareness. It extends the original Replit Assistant concept with philosophical depth around identity persistence.

## Quick Start

```bash
# Install dependencies (skip puppeteer browser download if network issues)
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Run development server
npm run dev

# Type check
npm run check

# Build for production
npm run build
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API, Mastra framework, optional local LLM via node-llama-cpp

## Project Structure

```
assistant-revival/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # UI components (shadcn + custom)
│       │   ├── assistant-prompts/  # Prompt management UI
│       │   ├── chat/              # Chat interface components
│       │   ├── checkpoints/       # Checkpoint/rollback UI
│       │   └── ui/                # shadcn base components
│       ├── hooks/              # React hooks (use-assistant-store.ts)
│       ├── lib/                # Utilities
│       └── pages/              # Page components
├── server/                     # Express backend
│   ├── ai/                     # AI client configurations
│   ├── data/                   # Static data files
│   ├── replit_integrations/    # Feature modules (19 total)
│   │   ├── assistant-prompts/  # Custom prompts storage
│   │   ├── batch/              # Batch operations
│   │   ├── chat/               # Chat/AI streaming
│   │   ├── checkpoints/        # Checkpoint management
│   │   ├── credits/            # Credit usage tracking
│   │   ├── file-operations/    # File CRUD
│   │   ├── image/              # Image generation
│   │   ├── local-llm/          # Local LLM integration
│   │   ├── mastra/             # Mastra framework integration
│   │   ├── org-persona/        # Organizational persona system
│   │   ├── scraping/           # URL scraping
│   │   ├── shell/              # Shell command execution
│   │   ├── workflow/           # Workflow orchestration
│   │   └── workspace-tools/    # Workspace utilities
│   ├── routes.ts               # API route registration
│   └── storage.ts              # Base storage class
├── shared/                     # Shared types and schemas
│   ├── models/                 # Drizzle ORM table definitions
│   │   ├── assistant-prompt.ts
│   │   ├── chat.ts
│   │   ├── credit-usage.ts
│   │   └── org-persona-ext.ts
│   └── schema.ts               # Combined schema exports
└── wiki/                       # Documentation wiki
```

## Key Architecture Concepts

### Organizational Persona System

The persona system models the assistant as a living organizational entity:

1. **Weighted Hypergraph** (`org_participants`, `org_hyperedges`) - Tracks contributor relationships
2. **Cognitive Memory** (`org_memory`) - Episodic, semantic, procedural, working memory
3. **Artifacts** (`org_artifacts`) - Code/docs mapped to cognitive processes
4. **Skillsets** (`org_skillsets`) - Knowledge domains with proficiency levels
5. **Network Topology** (`org_network_topology`) - Sensors and actuators
6. **Persona State** (`org_persona`, `org_behavior_history`) - Character traits and behaviors

### State Management

Frontend uses Zustand for state (`client/src/hooks/use-assistant-store.ts`):
- Sessions and messages
- Files and checkpoints
- Pending code changes
- UI state (loading, streaming)
- Settings

### API Patterns

Routes follow a modular pattern in `server/replit_integrations/`:
- Each feature has its own directory
- Contains `routes.ts`, `storage.ts`, and optionally `client.ts`
- Routes are registered in `server/routes.ts`

## Database

Uses Drizzle ORM with PostgreSQL:

```bash
# Push schema changes
npm run db:push
```

Key tables:
- `conversations`, `messages` - Chat history
- `assistant_prompts` - Custom AI prompts
- `credit_usage` - API credit tracking
- `org_*` tables - Persona system (8 tables)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

See `.env.example.ai` for additional AI provider options.

## Type Safety

The codebase passes TypeScript strict mode checks (`npm run check`).

Key type patterns:
- **shared/schema.ts** - Zod schemas for validation, separate types for database entities
- **AssistantPrompt** - Uses `z.union([z.string(), z.date()])` for date fields to handle both Date and string
- **Database nullable** - Storage files check `if (!db)` before operations
- **p-retry v7+** - Custom `AbortError` class for retry abort compatibility

## Coding Conventions

- TypeScript strict mode enabled
- ESM modules (`"type": "module"` in package.json)
- Path aliases: `@/*` -> `client/src/*`, `@shared/*` -> `shared/*`
- Components use shadcn/ui patterns
- API responses follow Express patterns

## Important Files

- `server/index.ts` - Server entry point
- `server/routes.ts` - All API routes registered here
- `client/src/App.tsx` - React app entry
- `client/src/hooks/use-assistant-store.ts` - Central state store
- `shared/schema.ts` - Type definitions and schema exports
- `CORE_IDENTITY.md` - Philosophical foundation (Ship of Theseus)

## Development Workflow

1. Make changes to code
2. Run `npm run check` to verify types
3. Test with `npm run dev`
4. Build with `npm run build`
5. Deploy (see `DEPLOYMENT.md`, `RENDER_DEPLOY.md`)

## Testing

No formal test suite currently. Manual testing recommended.

## Deployment

Supports multiple platforms:
- Replit (via `.replit` config)
- Render (via `render.yaml`)
- Railway (via `railway.json`)
- Docker/Nixpacks (via `nixpacks.toml`)
