
# Tutorial: Understanding the System Architecture

## Introduction

Dive deep into the Assistant Memorial Edition architecture to understand how all pieces fit together.

**Time Required:** 45-50 minutes  
**Prerequisites:** TypeScript, React, Node.js knowledge  
**Target Audience:** Developers, Contributors

## Part 1: Project Overview (8 minutes)

### The Big Picture

**Architecture Diagram Analysis:**

```
Client (React) ←→ Server (Express) ←→ External APIs
     ↓                    ↓
  Zustand            PostgreSQL
  (State)            (Optional)
```

### Technology Stack Deep Dive

**Exercise 1: Explore package.json**

Open `package.json` and identify:

```javascript
// Client Dependencies
"react": "^18.x" // UI framework
"zustand": "^4.x" // State management  
"@tanstack/react-query": "^5.x" // Server state
"wouter": "^3.x" // Routing
"tailwindcss": "^3.x" // Styling

// Server Dependencies
"express": "^4.x" // Web framework
"drizzle-orm": "^0.x" // Database ORM
"pg": "^8.x" // PostgreSQL client
```

**Exercise 2: Build Process Analysis**

Study the build configuration:

```bash
# Development
npm run dev
# Runs: vite (client) + tsx watch (server)

# Production
npm run build
# 1. Vite builds client → dist/public
# 2. esbuild bundles server → dist/index.js
```

### Directory Structure Tour

Navigate through the codebase:

```
project/
├── client/          # Frontend React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── pages/       # Route pages
│   
├── server/          # Backend Express app
│   ├── replit_integrations/  # Feature modules
│   │   ├── chat/       # Chat system
│   │   ├── assistant-prompts/  # Prompt management
│   │   ├── image/      # Image generation
│   │   └── batch/      # Batch processing
│   
├── shared/          # Shared types & schemas
│   ├── models/      # TypeScript interfaces
│   └── schema.ts    # Database schema
│   
└── migrations/      # Database migrations
```

## Part 2: Frontend Architecture (12 minutes)

### Component Hierarchy

**Exercise 3: Trace a User Action**

Follow a message send through the stack:

```
1. User types in ChatInput component
   → client/src/components/chat/chat-input.tsx
   
2. Form submission triggers onSubmit handler
   
3. Handler calls useMutation from React Query
   → lib/queryClient.ts
   
4. Mutation sends POST to /api/chat
   
5. Response updates chat container
   → client/src/components/chat/chat-container.tsx
```

**Exercise 4: State Management Flow**

Open and analyze `use-assistant-store.ts`:

```typescript
// Find:
interface AssistantStore {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
}

// Understand:
// 1. Zustand creates the store
// 2. persist() middleware saves to localStorage
// 3. Components use: const { files, addFile } = useAssistantStore()
```

**Exercise 5: React Query Patterns**

Study a query in `chat-container.tsx`:

```typescript
const { data: messages } = useQuery({
  queryKey: ['messages', conversationId],
  queryFn: () => fetch(`/api/chat/conversations/${conversationId}`)
    .then(r => r.json()),
  staleTime: 30000, // Cache for 30 seconds
});

// Key concepts:
// - queryKey: Unique identifier + dependencies
// - queryFn: Fetch function
// - staleTime: How long data stays fresh
// - Auto refetch on window focus
```

### Component Patterns

**Exercise 6: Atomic Design Analysis**

Identify component levels:

```
Atoms (ui/):
└── button.tsx → Basic interactive element

Molecules:
└── file-card.tsx → Button + Text + Icon

Organisms:
└── chat-container.tsx → Multiple molecules

Templates:
└── Home page layout

Pages:
└── home.tsx → Complete page
```

**Exercise 7: Create a Simple Component**

Practice the pattern:

```typescript
// 1. Create file: components/example/hello-world.tsx

import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface HelloWorldProps {
  name: string;
}

export function HelloWorld({ name }: HelloWorldProps) {
  return (
    <Card>
      <CardHeader>Hello Component</CardHeader>
      <CardContent>
        Welcome, {name}!
      </CardContent>
    </Card>
  );
}

// 2. Use in home.tsx:
import { HelloWorld } from "@/components/example/hello-world";

// In render:
<HelloWorld name="Developer" />
```

## Part 3: Backend Architecture (12 minutes)

### Express Server Structure

**Exercise 8: Request Flow**

Trace a chat request:

```
1. Client: POST /api/chat
   ↓
2. server/index.ts: App entry point
   ↓
3. server/routes.ts: Route registration
   ↓
4. server/replit_integrations/chat/routes.ts: Chat routes
   ↓
5. chatRoutes.post('/chat', handler)
   ↓
6. Handler processes, calls AI API
   ↓
7. Response streams back via SSE
```

**Exercise 9: Integration Pattern**

Study the integration structure:

```typescript
// server/replit_integrations/chat/index.ts

export class ChatIntegration {
  // Public API
  async sendMessage(message: string): Promise<Response> {
    // Implementation
  }
  
  async getConversations(): Promise<Conversation[]> {
    // Implementation
  }
}

// server/replit_integrations/chat/routes.ts
export const chatRoutes = Router();

chatRoutes.post('/chat', async (req, res) => {
  const { message } = req.body;
  const response = await chatIntegration.sendMessage(message);
  // Stream response
});
```

**Exercise 10: Storage Abstraction**

Understand the storage pattern:

```typescript
// server/storage.ts defines interface:

interface Storage {
  save<T>(key: string, value: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
}

// Two implementations:

1. MemoryStorage:
   - Fast
   - Lost on restart
   - Good for development

2. DatabaseStorage:
   - Persistent
   - Requires DATABASE_URL
   - Good for production
```

## Part 4: Data Flow & APIs (10 minutes)

### Server-Sent Events (SSE)

**Exercise 11: Understand SSE Streaming**

Analyze the chat streaming:

```typescript
// Server side (routes.ts):
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
});

// Stream chunks:
for await (const chunk of aiResponse) {
  res.write(`data: ${JSON.stringify(chunk)}\n\n`);
}

res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
```

```typescript
// Client side (chat-container.tsx):
const eventSource = new EventSource('/api/chat/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'chunk') {
    // Append to message
  } else if (data.type === 'done') {
    // Close stream
    eventSource.close();
  }
};
```

**Exercise 12: API Design Patterns**

Study RESTful conventions:

```typescript
// CRUD operations for prompts:

GET    /api/prompts          // List all
POST   /api/prompts          // Create new
GET    /api/prompts/:id      // Get one
PUT    /api/prompts/:id      // Update
DELETE /api/prompts/:id      // Delete

// Request/Response:
POST /api/prompts
Body: { name, description, systemMessage }
Response: { id, ...data, createdAt }
```

### Database Integration

**Exercise 13: Drizzle ORM Schema**

Examine `shared/schema.ts`:

```typescript
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .references(() => conversations.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Exercise 14: Database Migrations**

Understanding migrations:

```bash
# Generate migration from schema changes
npm run drizzle-kit generate

# Creates: migrations/0001_migration_name.sql

# Apply migration
npm run drizzle-kit migrate

# Drizzle runs the SQL automatically
```

## Part 5: Extension Points (8 minutes)

### Adding a New Feature

**Exercise 15: Plan a Search Feature**

Walk through the process:

```
1. Define Types (shared/models/search.ts):
   - SearchQuery interface
   - SearchResult interface

2. Backend Integration (server/replit_integrations/search/):
   - index.ts: SearchService class
   - routes.ts: Express routes
   - storage.ts: Data persistence

3. Frontend Components (client/src/components/search/):
   - search-bar.tsx: Input component
   - search-results.tsx: Results display

4. State Management:
   - Add to React Query
   - Or create new Zustand store if needed

5. Integration:
   - Register routes in server/routes.ts
   - Add component to UI
```

**Exercise 16: Create a Minimal Feature**

Hands-on implementation:

```typescript
// 1. shared/models/example.ts
export interface Example {
  id: string;
  message: string;
}

// 2. server/replit_integrations/example/routes.ts
import { Router } from 'express';

export const exampleRoutes = Router();

exampleRoutes.get('/hello', (req, res) => {
  res.json({ message: 'Hello from example feature!' });
});

// 3. server/routes.ts
import { exampleRoutes } from './replit_integrations/example/routes';
app.use('/api/example', exampleRoutes);

// 4. client/src/components/example/example-display.tsx
import { useQuery } from '@tanstack/react-query';

export function ExampleDisplay() {
  const { data } = useQuery({
    queryKey: ['example'],
    queryFn: () => fetch('/api/example/hello').then(r => r.json()),
  });

  return <div>{data?.message}</div>;
}

// 5. Test in browser
```

## Part 6: Build & Deployment (5 minutes)

### Development Workflow

**Exercise 17: Development Server**

Understand hot reloading:

```bash
npm run dev

# Runs concurrently:
# 1. Vite dev server (port 5173)
#    - HMR for instant React updates
#    - Proxy API requests to port 5000
#
# 2. tsx watch (port 5000)
#    - Auto-restart on server changes
#    - Serves API and SSE streams
```

### Production Build

**Exercise 18: Build Process**

Understand the build:

```bash
npm run build

# Step 1: Vite builds client
#   - Bundles React app
#   - Minifies JS/CSS
#   - Outputs to dist/public/

# Step 2: esbuild bundles server
#   - Bundles server code
#   - Includes dependencies
#   - Outputs to dist/index.js

# Step 3: Run production
npm start
# Serves static files + API from dist/
```

## Advanced Topics

### Performance Optimization

**Key Patterns:**

```typescript
// 1. Code splitting
const HeavyComponent = lazy(() => import('./heavy-component'));

// 2. Memoization
const expensive = useMemo(() => compute(data), [data]);

// 3. Query optimization
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // Cache 5 minutes
});

// 4. Virtual scrolling (for large lists)
// Use react-window or similar
```

### Error Handling

**Patterns Used:**

```typescript
// 1. Error boundaries (React)
<ErrorBoundary fallback={<ErrorUI />}>
  <App />
</ErrorBoundary>

// 2. Try-catch (async)
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed:', error);
  showToast({ title: 'Error', description: error.message });
}

// 3. Query error handling
const { data, error, isError } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: 3,
});

if (isError) return <ErrorDisplay error={error} />;
```

## What You've Learned

1. ✅ Overall system architecture
2. ✅ Frontend component patterns
3. ✅ Backend integration structure
4. ✅ Data flow and APIs
5. ✅ Database integration
6. ✅ Extension points
7. ✅ Build and deployment

## Next Steps

- **Explore:** Browse the codebase with this knowledge
- **Experiment:** Create a small feature
- **Contribute:** Pick an issue and implement it
- **Document:** Share what you learn

## Resources

- [Architecture Guide](../../guides/dev/architecture.md)
- [Extending Features Guide](../../guides/dev/extending-features.md)
- [Contributing Guide](../../guides/dev/contributing.md)
