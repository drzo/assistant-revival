
# System Architecture Guide

## Overview

Assistant Memorial Edition is built as a full-stack TypeScript application with a React frontend and Express backend, featuring real-time AI chat capabilities, file management, and checkpoint/rollback functionality.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Components  │  │    Hooks     │  │    Stores    │  │
│  │              │  │              │  │   (Zustand)  │  │
│  │ - Chat UI    │  │ - useToast   │  │ - Assistant  │  │
│  │ - Files      │  │ - useMobile  │  │   State      │  │
│  │ - Prompts    │  │ - Query      │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                   │                   │        │
│         └───────────────────┴───────────────────┘        │
│                             │                            │
│                      TanStack Query                      │
└─────────────────────────────┼───────────────────────────┘
                              │
                         HTTP/SSE
                              │
┌─────────────────────────────┼───────────────────────────┐
│                    Server (Express)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Routes    │  │  Integrations│  │   Storage    │  │
│  │              │  │              │  │              │  │
│  │ - /api/chat  │  │ - Chat       │  │ - Memory     │  │
│  │ - /api/      │  │ - Image      │  │ - Database   │  │
│  │   prompts    │  │ - Batch      │  │   (Drizzle)  │  │
│  │ - /api/files │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                             │                            │
└─────────────────────────────┼───────────────────────────┘
                              │
                       External APIs
                              │
                    ┌─────────┴─────────┐
                    │   Replit AI API   │
                    └───────────────────┘
```

## Frontend Architecture

### Technology Stack

**Core:**
- React 18 with TypeScript
- Vite (build tool)
- Wouter (routing)

**State Management:**
- Zustand with persistence
- TanStack React Query for server state

**UI Framework:**
- shadcn/ui components
- Radix UI primitives
- Tailwind CSS
- Lucide icons

**Layout:**
- react-resizable-panels
- CSS Grid & Flexbox

### Directory Structure

```
client/
├── src/
│   ├── components/
│   │   ├── chat/           # Chat interface
│   │   ├── files/          # File management
│   │   ├── assistant-prompts/ # Prompt system
│   │   ├── checkpoints/    # Checkpoint UI
│   │   ├── diff/           # Code diff viewer
│   │   ├── sidebar/        # Navigation
│   │   └── ui/             # shadcn components
│   ├── hooks/
│   │   ├── use-assistant-store.ts
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── queryClient.ts
│   │   └── file-utils.ts
│   ├── pages/
│   │   ├── home.tsx
│   │   └── not-found.tsx
│   ├── App.tsx
│   └── main.tsx
└── public/
```

### State Management

**Zustand Store (Client-side):**
```typescript
interface AssistantStore {
  files: UploadedFile[];
  currentPromptId: string;
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  setPrompt: (id: string) => void;
}
```

**React Query (Server State):**
```typescript
// Chat messages
useQuery(['messages', conversationId])

// Assistant prompts
useQuery(['prompts'])

// File operations
useMutation(['uploadFile'])
```

### Component Architecture

**Atomic Design Pattern:**
- **Atoms**: Button, Input, Label (ui/)
- **Molecules**: FileCard, ChatMessage
- **Organisms**: ChatContainer, FileSidebar
- **Templates**: MainLayout
- **Pages**: Home, NotFound

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store / React Query Mutation
    ↓
API Request
    ↓
Server Processing
    ↓
Response
    ↓
React Query Cache Update
    ↓
Component Re-render
```

## Backend Architecture

### Technology Stack

**Core:**
- Node.js with Express
- TypeScript
- tsx (development runtime)
- esbuild (production)

**Database:**
- PostgreSQL (optional)
- Drizzle ORM
- drizzle-kit for migrations

**Libraries:**
- p-limit / p-retry (batch processing)
- Server-Sent Events (SSE)

### Directory Structure

```
server/
├── replit_integrations/
│   ├── chat/
│   │   ├── index.ts       # Chat service
│   │   ├── routes.ts      # Endpoints
│   │   └── storage.ts     # Data persistence
│   ├── assistant-prompts/
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── storage.ts
│   │   └── seed.ts        # Default prompts
│   ├── image/
│   │   ├── client.ts      # API client
│   │   ├── routes.ts
│   │   └── index.ts
│   └── batch/
│       ├── index.ts
│       └── utils.ts       # Batch processing
├── db.ts                  # Database connection
├── index.ts               # App entry point
├── routes.ts              # Route registration
├── storage.ts             # Storage abstraction
├── static.ts              # Static file serving
└── vite.ts                # Vite dev middleware
```

### API Design

**RESTful Endpoints:**
```
POST   /api/chat                 # Send message
GET    /api/chat/stream          # SSE stream
POST   /api/chat/conversations   # New conversation
GET    /api/chat/conversations   # List conversations

GET    /api/prompts              # List prompts
POST   /api/prompts              # Create prompt
PUT    /api/prompts/:id          # Update prompt
DELETE /api/prompts/:id          # Delete prompt

POST   /api/files/upload         # Upload file
GET    /api/files/:id            # Get file
DELETE /api/files/:id            # Delete file
```

**SSE Stream Format:**
```typescript
event: message
data: {"type": "chunk", "content": "Hello"}

event: message
data: {"type": "done"}
```

### Integration Layer

**Chat Integration:**
```typescript
interface ChatIntegration {
  sendMessage(message: string, context: Context): AsyncIterator
  getConversations(): Conversation[]
  createConversation(): Conversation
}
```

**Storage Abstraction:**
```typescript
interface Storage {
  save<T>(key: string, value: T): Promise<void>
  load<T>(key: string): Promise<T | null>
  delete(key: string): Promise<void>
}

// Implementations:
- MemoryStorage (in-memory)
- DatabaseStorage (PostgreSQL)
```

## Database Schema

### Tables

**conversations:**
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**messages:**
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**assistant_prompts:**
```sql
CREATE TABLE assistant_prompts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  system_message TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Drizzle Schema

```typescript
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Data Models

### Shared Types

Located in `shared/`:

```typescript
// shared/models/chat.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
  createdAt: number;
}

// shared/models/assistant-prompt.ts
export interface AssistantPrompt {
  id: string;
  name: string;
  description?: string;
  systemMessage: string;
  isDefault: boolean;
}
```

## Build & Deployment

### Development

```bash
npm run dev
# Runs:
# - Vite dev server (client)
# - tsx watch (server)
# - Concurrent mode
```

### Production Build

```bash
npm run build
# Steps:
# 1. Build client (Vite)
# 2. Build server (esbuild)
# 3. Output to dist/
```

### Build Configuration

**Vite (client):**
```typescript
{
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  }
}
```

**esbuild (server):**
```typescript
{
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  external: ['pg', 'drizzle-orm']
}
```

## Environment Configuration

### Required Variables

```bash
# Optional: Database
DATABASE_URL=postgresql://user:pass@host/db

# Development
NODE_ENV=development
PORT=5000
```

### Replit-Specific

```bash
REPL_ID=<auto-set>
REPL_OWNER=<auto-set>
REPLIT_DB_URL=<auto-set>
```

## Security Considerations

### Input Validation

**File Uploads:**
- Size limits enforced
- Type checking
- Sanitization

**API Requests:**
- Request validation
- Rate limiting (TODO)
- Input sanitization

### Authentication

- Session-based (Express sessions)
- PostgreSQL session store (when DB available)
- Secure cookie settings

## Performance Optimization

### Frontend

**Code Splitting:**
- Route-based splitting
- Dynamic imports for heavy components
- Lazy loading images

**Caching:**
- React Query caching strategy
- LocalStorage for preferences
- Stale-while-revalidate pattern

### Backend

**Database:**
- Connection pooling
- Prepared statements
- Indexed queries

**Cold Start Optimization:**
- Selective dependency bundling
- Lazy module loading
- Minimal initial bundle

## Monitoring & Debugging

### Logging

```typescript
// Development
console.log('[express]', method, path, status, time);

// Production
// TODO: Structured logging with levels
```

### Error Handling

**Frontend:**
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Backend:**
```typescript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

## Extension Points

### Adding New Integrations

1. Create folder in `server/replit_integrations/`
2. Implement interface:
```typescript
export interface Integration {
  routes: Router;
  initialize?: () => Promise<void>;
}
```
3. Register in `server/routes.ts`

### Adding New UI Components

1. Create component in appropriate folder
2. Add to `components/ui/` if reusable
3. Export from index if needed
4. Update types in `@shared`

### Database Migrations

```bash
# Generate migration
npm run drizzle-kit generate

# Run migration
npm run drizzle-kit migrate
```

## Testing Strategy

### Unit Tests (TODO)
- Component tests with React Testing Library
- API endpoint tests
- Utility function tests

### Integration Tests (TODO)
- E2E chat flow
- File upload/download
- Checkpoint/restore

### Manual Testing
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility (keyboard nav, screen readers)
