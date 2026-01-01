
# Contributing Guide

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- PostgreSQL (optional, for database features)

### Local Setup

```bash
# Clone repository
git clone <repo-url>
cd assistant-memorial-edition

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Test locally
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### TypeScript

**Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Type Definitions:**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email?: string;
}

// ❌ Avoid
const user: any = { ... };
```

**Async/Await:**
```typescript
// ✅ Good
async function getData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// ❌ Avoid
function getData() {
  return fetch('/api/data')
    .then(r => r.json())
    .catch(err => console.error(err));
}
```

### React

**Functional Components:**
```typescript
// ✅ Good
export function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// ❌ Avoid
export class MyComponent extends Component {
  render() {
    return <h1>{this.props.title}</h1>;
  }
}
```

**Hooks:**
```typescript
// ✅ Good - Extract custom hooks
function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// ❌ Avoid - Logic in component
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);
  
  // ...
}
```

**Props:**
```typescript
// ✅ Good - Explicit interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  // ...
}
```

### CSS/Tailwind

**Utility-First:**
```tsx
// ✅ Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">

// ❌ Avoid custom CSS when Tailwind suffices
<div className="custom-card">
```

**Component Classes:**
```tsx
// ✅ Good - Reusable variants
<Button variant="primary" size="lg">

// ❌ Avoid inline style variations
<button className="px-4 py-2 bg-blue-500 text-white rounded">
```

### File Organization

**Naming Conventions:**
```
components/       # kebab-case for folders
  chat/
    chat-container.tsx   # kebab-case for files
    chat-message.tsx
    
hooks/
  use-assistant-store.ts  # use- prefix

lib/
  file-utils.ts          # descriptive names
```

**Exports:**
```typescript
// ✅ Good - Named exports
export function MyComponent() { }
export const MyHook = () => { };

// ❌ Avoid default exports (except pages)
export default function MyComponent() { }
```

## Git Workflow

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(chat): add message search functionality
fix(files): resolve upload error on large files
docs(wiki): add API integration guide
refactor(store): simplify state management
```

### Branch Naming

```
feature/feature-name
bugfix/issue-description
docs/documentation-update
refactor/code-improvement
```

### Pull Requests

**PR Title:**
```
feat: Add search functionality to chat
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Changes
- Added search component
- Implemented search API endpoint
- Updated documentation

## Testing
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Works on mobile
- [ ] Accessibility checked

## Screenshots
[If applicable]

## Related Issues
Closes #123
```

## Testing Guidelines

### Unit Tests

```typescript
// Component test
describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const { getByText } = render(
      <ChatMessage
        message={{ role: 'user', content: 'Hello' }}
      />
    );
    
    expect(getByText('Hello')).toBeInTheDocument();
  });
});

// Hook test
describe('useAssistantStore', () => {
  it('adds file to store', () => {
    const { result } = renderHook(() => useAssistantStore());
    
    act(() => {
      result.current.addFile({ id: '1', name: 'test.js' });
    });
    
    expect(result.current.files).toHaveLength(1);
  });
});
```

### Integration Tests

```typescript
describe('Chat Flow', () => {
  it('sends message and receives response', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    
    const input = getByPlaceholderText('Ask anything...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form'));
    
    await waitFor(() => {
      expect(getByText(/response/i)).toBeInTheDocument();
    });
  });
});
```

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode compatible
- [ ] Keyboard accessible
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Edge cases covered

## Documentation

### Code Comments

```typescript
// ✅ Good - Explain why, not what
// Debounce search to avoid excessive API calls
const debouncedSearch = useDebouncedValue(query, 300);

// ❌ Avoid - Obvious comments
// Set the value to query
const debouncedSearch = query;
```

**JSDoc for Public APIs:**
```typescript
/**
 * Uploads a file to the server.
 * 
 * @param file - File to upload
 * @param onProgress - Optional progress callback
 * @returns Promise resolving to uploaded file metadata
 * @throws {UploadError} If upload fails
 */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<FileMetadata> {
  // Implementation
}
```

### Wiki Documentation

When adding features, update:

1. **Feature Documentation** (`wiki/features/`)
   - What the feature does
   - How it works
   - API reference

2. **User Guide** (`wiki/guides/use/`)
   - How to use the feature
   - Common use cases
   - Examples

3. **Developer Guide** (`wiki/guides/dev/`)
   - Implementation details
   - Architecture decisions
   - Extension points

### README Updates

Update README.md when:
- Adding major features
- Changing setup process
- Modifying deployment steps
- Adding new dependencies

## Code Review

### Reviewer Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No unnecessary dependencies
- [ ] Performance impact considered
- [ ] Security implications reviewed
- [ ] Accessibility maintained
- [ ] Error handling is robust

### Common Feedback

**Performance:**
```typescript
// 🔴 Issue
{items.map(item => (
  <ExpensiveComponent key={item.id} item={item} />
))}

// ✅ Fix - Memoize expensive components
const MemoizedComponent = memo(ExpensiveComponent);
{items.map(item => (
  <MemoizedComponent key={item.id} item={item} />
))}
```

**Type Safety:**
```typescript
// 🔴 Issue
const data: any = await fetchData();

// ✅ Fix
const data: UserData = await fetchData();
```

**Error Handling:**
```typescript
// 🔴 Issue
const data = await fetch('/api/data').then(r => r.json());

// ✅ Fix
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Fetch failed');
  const data = await response.json();
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw error;
}
```

## Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Changelog

Update `CHANGELOG.md`:

```markdown
## [1.2.0] - 2024-01-15

### Added
- Search functionality in chat
- Keyboard shortcuts panel

### Fixed
- File upload error on large files
- Dark mode contrast issues

### Changed
- Improved prompt selector UX
```

### Deployment

```bash
# Update version
npm version minor

# Build
npm run build

# Test production build
npm start

# Deploy to Replit
# (handled by Replit Deployments)
```

## Getting Help

### Resources

- **Documentation**: `/wiki/` folder
- **Code Examples**: Look at existing components
- **Community**: Ask in discussions
- **Issues**: Check existing issues first

### Asking Questions

When asking for help, include:

1. What you're trying to do
2. What you've tried
3. Error messages (if any)
4. Relevant code snippets
5. Screenshots (if UI-related)

### Proposing Features

Before implementing large features:

1. Open an issue describing the feature
2. Discuss approach and design
3. Get feedback from maintainers
4. Implement with agreed-upon approach

## Best Practices

### DRY (Don't Repeat Yourself)

```typescript
// ❌ Repeated logic
function formatUser1(user) {
  return `${user.firstName} ${user.lastName}`;
}
function formatUser2(user) {
  return `${user.firstName} ${user.lastName}`;
}

// ✅ Shared utility
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

### Single Responsibility

```typescript
// ❌ Component does too much
function UserDashboard() {
  // Fetches data
  // Renders UI
  // Handles form submission
  // Manages authentication
}

// ✅ Separated concerns
function UserDashboard() {
  return (
    <>
      <UserProfile />
      <UserStats />
      <UserSettings />
    </>
  );
}
```

### Composition Over Inheritance

```typescript
// ✅ Composition
function EnhancedButton(props) {
  return (
    <Button {...props}>
      <Icon />
      {props.children}
    </Button>
  );
}

// ❌ Avoid class inheritance in React
class EnhancedButton extends Button {
  // ...
}
```

### Fail Fast

```typescript
// ✅ Early validation
function processUser(user: User) {
  if (!user.id) throw new Error('User ID required');
  if (!user.email) throw new Error('Email required');
  
  // Process user
}

// ❌ Late validation
function processUser(user: User) {
  // Do lots of work
  if (!user.id) {
    // Oops, wasted effort
  }
}
```

## Common Pitfalls

### Avoid

1. **Any types**: Use proper TypeScript types
2. **Inline styles**: Use Tailwind classes
3. **Direct DOM manipulation**: Use React state
4. **Mutations**: Keep state immutable
5. **Missing error handling**: Always handle errors
6. **No loading states**: Show feedback to users
7. **Hardcoded values**: Use constants/config
8. **Large components**: Break into smaller pieces

### Remember

1. **Test your changes**: Manually and with tests
2. **Update documentation**: Keep wiki current
3. **Consider accessibility**: Keyboard nav, screen readers
4. **Mobile-first**: Design for small screens first
5. **Performance**: Monitor bundle size, render performance
6. **Security**: Validate inputs, sanitize outputs
7. **User experience**: Loading states, error messages, feedback
