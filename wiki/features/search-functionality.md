
# Search Functionality

## Overview
Comprehensive search capabilities across conversations, files, and code to quickly find relevant information.

## Search Types

### 1. Global Search
- **Cross-conversation**: Search all conversations
- **File Content**: Search within uploaded files
- **Code Search**: Find code snippets and patterns
- **Full-text**: Complete content indexing

### 2. Conversation Search
- **Message History**: Search within current conversation
- **Semantic Search**: Find similar content
- **Filter by Type**: User, assistant, or system messages
- **Date Range**: Search by time period

### 3. File Search
- **Name Search**: Find files by name
- **Content Search**: Search inside files
- **Language Filter**: Filter by programming language
- **Fuzzy Matching**: Handle typos and variations

## Features

### Advanced Filters
- **Date Range**: Filter by upload or modification date
- **File Type**: Filter by extension or language
- **Message Author**: User vs assistant messages
- **Contains Code**: Messages with code blocks

### Search Syntax
```
// Basic search
hello world

// Exact phrase
"exact phrase match"

// File name
file:server.ts

// Language
lang:typescript

// Date range
after:2024-01-01 before:2024-12-31

// Combined
file:*.ts "async function" after:2024-01-01
```

### Results Display
- **Highlighted Matches**: Show search terms in context
- **Ranked Results**: Relevance-based ordering
- **Preview Snippets**: Show surrounding content
- **Quick Navigation**: Jump to result location

## Technical Implementation

### Search Index
```typescript
interface SearchIndex {
  id: string;
  type: 'message' | 'file' | 'code';
  content: string;
  metadata: Record<string, any>;
  timestamp: Date;
}
```

### Search Engine
```typescript
async function search(
  query: string,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  // Tokenize query
  // Apply filters
  // Rank results
  // Return matches
}
```

### Indexing Strategy
- Real-time indexing for new content
- Background re-indexing for updates
- Incremental indexing for performance
- Stop words and stemming

## Integration

### Search Bar
- Global search in header
- Context-aware suggestions
- Recent searches
- Search history

### Keyboard Shortcuts
- **Cmd/Ctrl + F**: Open search
- **Cmd/Ctrl + Shift + F**: Advanced search
- **Enter**: Jump to next result
- **Shift + Enter**: Jump to previous result

### Search Context
- Highlight all occurrences
- Navigate between matches
- Replace functionality (files)
- Export search results

## Performance

### Optimization
- Debounced search input
- Cached frequent queries
- Lazy loading results
- Virtual scrolling for large result sets

### Indexing
- Asynchronous indexing
- Batched updates
- Compressed index storage
- Periodic index cleanup

## Use Cases

### 1. Debug Assistance
- Find error messages in chat history
- Locate specific code changes
- Track conversation about bugs

### 2. Knowledge Retrieval
- Find previous solutions
- Reference past decisions
- Locate documentation snippets

### 3. Code Navigation
- Find function definitions
- Locate API usage examples
- Search for patterns across files
