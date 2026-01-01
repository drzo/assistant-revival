
# Extending Features

## Adding New Features

### Feature Development Workflow

1. **Plan & Design**
   - Define feature requirements
   - Design data models
   - Plan UI/UX
   - Consider API contracts

2. **Implement Backend**
   - Create integration folder
   - Define routes
   - Implement storage
   - Add types to `shared/`

3. **Implement Frontend**
   - Create components
   - Add state management
   - Integrate with API
   - Style with Tailwind

4. **Test & Document**
   - Manual testing
   - Update wiki docs
   - Add to changelog

### Example: Adding Search Feature

#### Step 1: Define Types

```typescript
// shared/models/search.ts
export interface SearchQuery {
  query: string;
  filters?: {
    fileTypes?: string[];
    dateRange?: [number, number];
  };
}

export interface SearchResult {
  id: string;
  type: 'message' | 'file' | 'code';
  content: string;
  relevance: number;
  metadata: Record<string, any>;
}
```

#### Step 2: Backend Implementation

```typescript
// server/replit_integrations/search/index.ts
export class SearchService {
  async search(query: SearchQuery): Promise<SearchResult[]> {
    // Implementation
  }
}

// server/replit_integrations/search/routes.ts
import { Router } from 'express';

export const searchRoutes = Router();

searchRoutes.post('/search', async (req, res) => {
  const query: SearchQuery = req.body;
  const results = await searchService.search(query);
  res.json(results);
});
```

#### Step 3: Frontend Components

```typescript
// client/src/components/search/search-bar.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function SearchBar() {
  const [query, setQuery] = useState('');
  
  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then(r => r.json()),
    enabled: query.length > 2,
  });

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results && <SearchResults results={results} />}
    </div>
  );
}
```

#### Step 4: Integration

```typescript
// server/routes.ts
import { searchRoutes } from './replit_integrations/search/routes';

app.use('/api', searchRoutes);

// client/src/components/sidebar/app-sidebar.tsx
import { SearchBar } from '@/components/search/search-bar';

// Add to sidebar
<SearchBar />
```

## Database Migrations

### Creating Migrations

```typescript
// shared/schema.ts
export const searchIndex = pgTable('search_index', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  type: text('type').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Generate & Run

```bash
# Generate migration
npm run drizzle-kit generate

# Review migration in migrations/
# Run migration
npm run drizzle-kit migrate
```

### Migration Best Practices

- **Always backup** before running migrations
- **Test migrations** in development first
- **Make migrations reversible** when possible
- **Document breaking changes**

## API Integration Patterns

### RESTful Endpoints

```typescript
// Create
POST /api/resource
Body: { data }
Response: { id, ...data }

// Read
GET /api/resource/:id
Response: { id, ...data }

// Update
PUT /api/resource/:id
Body: { updates }
Response: { id, ...data }

// Delete
DELETE /api/resource/:id
Response: { success: true }

// List
GET /api/resource
Query: ?limit=10&offset=0
Response: { items: [...], total: N }
```

### Server-Sent Events

```typescript
// server/replit_integrations/example/routes.ts
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// client/src/hooks/use-sse.ts
export function useSSE(url: string) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => eventSource.close();
  }, [url]);

  return data;
}
```

## State Management

### Zustand Stores

```typescript
// client/src/hooks/use-example-store.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useExampleStore = create<ExampleStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    {
      name: 'example-storage',
    }
  )
);
```

### React Query Integration

```typescript
// client/src/lib/api.ts
export const api = {
  getItems: () =>
    fetch('/api/items').then((r) => r.json()),
  
  createItem: (data: ItemInput) =>
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// In component
const { data: items } = useQuery({
  queryKey: ['items'],
  queryFn: api.getItems,
});

const createMutation = useMutation({
  mutationFn: api.createItem,
  onSuccess: () => {
    queryClient.invalidateQueries(['items']);
  },
});
```

## UI Component Patterns

### Container/Presentation Pattern

```typescript
// Container (logic)
export function FeatureContainer() {
  const { data, isLoading } = useQuery(['feature']);
  const handleAction = () => { /* ... */ };

  if (isLoading) return <Skeleton />;

  return (
    <FeaturePresentation
      data={data}
      onAction={handleAction}
    />
  );
}

// Presentation (UI)
interface FeaturePresentationProps {
  data: Data;
  onAction: () => void;
}

export function FeaturePresentation({
  data,
  onAction,
}: FeaturePresentationProps) {
  return (
    <Card>
      <CardHeader>{data.title}</CardHeader>
      <CardContent>{data.content}</CardContent>
      <CardFooter>
        <Button onClick={onAction}>Action</Button>
      </CardFooter>
    </Card>
  );
}
```

### Compound Components

```typescript
interface FeatureContextValue {
  expanded: boolean;
  toggle: () => void;
}

const FeatureContext = createContext<FeatureContextValue | null>(null);

export function Feature({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <FeatureContext.Provider
      value={{ expanded, toggle: () => setExpanded(!expanded) }}
    >
      <div className="feature">{children}</div>
    </FeatureContext.Provider>
  );
}

Feature.Header = function FeatureHeader({ children }) {
  const { toggle } = useContext(FeatureContext)!;
  return <button onClick={toggle}>{children}</button>;
};

Feature.Content = function FeatureContent({ children }) {
  const { expanded } = useContext(FeatureContext)!;
  return expanded ? <div>{children}</div> : null;
};

// Usage
<Feature>
  <Feature.Header>Click me</Feature.Header>
  <Feature.Content>Hidden content</Feature.Content>
</Feature>
```

## Testing

### Component Testing

```typescript
// client/src/components/__tests__/example.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Example } from '../example';

describe('Example', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click', () => {
    const onClick = jest.fn();
    render(<Example onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Testing

```typescript
// server/__tests__/routes.test.ts
import request from 'supertest';
import { app } from '../index';

describe('API Routes', () => {
  it('GET /api/items', async () => {
    const response = await request(app)
      .get('/api/items')
      .expect(200);

    expect(response.body).toHaveProperty('items');
  });

  it('POST /api/items', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({ name: 'Test' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./heavy-component'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

```typescript
// Expensive computation
const expensiveValue = useMemo(
  () => computeExpensiveValue(data),
  [data]
);

// Callback stability
const handleClick = useCallback(
  () => doSomething(id),
  [id]
);
```

### Query Optimization

```typescript
// Prefetch data
queryClient.prefetchQuery({
  queryKey: ['items'],
  queryFn: api.getItems,
});

// Stale time optimization
useQuery({
  queryKey: ['items'],
  queryFn: api.getItems,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Error Handling

### Frontend Error Boundaries

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Backend Error Handling

```typescript
// server/middleware/error-handler.ts
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
}

// Apply to app
app.use(errorHandler);
```

## Documentation

### Code Documentation

```typescript
/**
 * Processes a batch of items with rate limiting and retry logic.
 * 
 * @param items - Array of items to process
 * @param processor - Function to process each item
 * @param options - Processing options
 * @returns Promise resolving to processed results
 * 
 * @example
 * ```ts
 * const results = await processBatch(
 *   items,
 *   async (item) => transform(item),
 *   { concurrency: 3, retries: 2 }
 * );
 * ```
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: BatchOptions = {}
): Promise<R[]> {
  // Implementation
}
```

### API Documentation

```markdown
## POST /api/items

Creates a new item.

**Request Body:**
```json
{
  "name": "string",
  "description": "string?",
  "metadata": "object?"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "createdAt": "number"
}
```

**Errors:**
- `400`: Invalid input
- `409`: Item already exists
- `500`: Server error
```

## Deployment

### Environment Variables

```bash
# Add to .env
NEW_FEATURE_ENABLED=true
NEW_FEATURE_API_KEY=secret
```

### Feature Flags

```typescript
// server/config.ts
export const config = {
  features: {
    search: process.env.SEARCH_ENABLED === 'true',
    imageGen: process.env.IMAGE_GEN_ENABLED === 'true',
  },
};

// In code
if (config.features.search) {
  app.use('/api/search', searchRoutes);
}
```

### Gradual Rollout

```typescript
// Percentage-based rollout
function isFeatureEnabled(userId: string): boolean {
  const hash = hashCode(userId);
  const percentage = parseInt(process.env.ROLLOUT_PERCENTAGE || '0');
  return (hash % 100) < percentage;
}
```
