
# Chat System

## Overview
The chat system provides real-time conversation with an AI assistant, supporting streaming responses, file mentions, and code interactions.

## Key Features

### 1. Conversation Management
- **Multiple Conversations**: Create and manage separate chat threads
- **Persistent History**: All messages stored in database
- **Conversation Titles**: Custom naming for easy identification
- **Delete Conversations**: Remove entire conversation threads

### 2. Message Types
- **User Messages**: Text input with file mentions
- **Assistant Messages**: AI-generated responses with streaming
- **System Messages**: Context and instructions

### 3. Streaming Responses
- **Real-time**: See assistant responses as they're generated
- **SSE Protocol**: Server-Sent Events for efficient streaming
- **Typing Indicator**: Visual feedback while assistant is thinking

### 4. File Context
- **@ Mentions**: Reference files using @filename syntax
- **File Content Injection**: Mentioned files included in AI context
- **Visual File Cards**: Display mentioned files in messages
- **Click to View**: Open files from message references

## Technical Implementation

### Database Schema
```sql
conversations (
  id: serial PRIMARY KEY,
  title: text NOT NULL,
  created_at: timestamp
)

messages (
  id: serial PRIMARY KEY,
  conversation_id: integer FOREIGN KEY,
  role: text NOT NULL,
  content: text NOT NULL,
  created_at: timestamp
)
```

### API Endpoints
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get conversation with messages
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `POST /api/conversations/:id/messages` - Send message (streaming)

### Components
- **ChatContainer**: Main chat interface
- **ChatMessage**: Individual message display
- **ChatInput**: Message input with file mentions
- **TypingIndicator**: Loading state indicator

### Streaming Implementation
```typescript
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");

for await (const chunk of stream) {
  res.write(`data: ${JSON.stringify({ content })}\n\n`);
}
```

## Message Features

### Code Blocks
- **Syntax Highlighting**: Language-specific formatting
- **Copy Button**: One-click code copying
- **Line Numbers**: Optional line numbering
- **Language Tags**: Visual language indicators

### Shell Commands
- **Command Cards**: Visual display of proposed commands
- **Copy to Execute**: Click to copy command
- **Run Indicator**: Visual feedback for command actions

### File Edits
- **Edit Preview**: Show proposed file changes
- **Line Diff Stats**: +/- line counts
- **File Path Display**: Clear file identification

## Usage

### Starting a Conversation
1. Click "New Chat" or use existing conversation
2. Type your message in the input box
3. Mention files with @ syntax if needed
4. Press Enter or click Send

### Mentioning Files
```
@filename.ts can you explain this function?
```

### Viewing Responses
- Responses stream in real-time
- Code blocks are syntax highlighted
- File references are clickable
- Shell commands show in action cards
