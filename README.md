# Assistant Memorial Edition

A tribute to Replit's deprecated Assistant tool - a lightweight AI-powered coding assistant for chat, quick edits, and collaborative development.

## 🎯 Vision

**Assistant Memorial Edition** preserves the core experience of Replit's Assistant: a lightweight, intuitive interface for developers to chat with AI, upload code files, receive suggestions, and apply changes with confidence through diff previews and rollback functionality.

This memorial edition captures the essence of what made Assistant special:
- **Lightweight**: Optimized for chat and quick edits
- **File Context**: Mention files with `@filename` to provide context
- **Smart Diffs**: Preview changes before applying them
- **Checkpoint System**: Rollback to any previous state with a single click
- **Streaming Responses**: Real-time AI responses as they're generated

## 🚀 Features

### Core Features
- **Chat Interface**: Real-time conversation with AI-powered assistant
- **File Management**: Upload and manage code files with syntax highlighting
- **File Mentions**: Reference files in chat with `@filename` syntax
- **Code Diff Viewer**: Side-by-side comparison of proposed changes
- **Checkpoint System**: Automatic versioning with rollback capability
- **Session History**: Organize conversations into sessions
- **Custom Prompts**: Create and manage custom assistant prompts

### Technical Features
- **Dark Mode by Default**: Elegant dark theme with light mode toggle
- **Streaming SSE**: Real-time response streaming from AI
- **Local Persistence**: All data persists in browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type-Safe**: Full TypeScript implementation
- **Component Library**: Built with shadcn/ui and Radix UI

## 📋 System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom Replit plugins
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with dark mode support
- **Components**: shadcn/ui built on Radix UI primitives
- **Layout**: Resizable split-pane with react-resizable-panels

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript with tsx
- **API Pattern**: RESTful with SSE for streaming
- **Storage**: In-memory with localStorage fallback
- **AI Integration**: OpenAI API via Replit AI Integrations

### Data Models

#### File
```typescript
{
  id: string;
  name: string;
  content: string;
  language: string;
  size: number;
  uploadedAt: string;
}
```

#### Message
```typescript
{
  id: string;
  role: "user" | "assistant";
  content: string;
  mentionedFiles?: string[];
  codeChanges?: CodeChange[];
  createdAt: string;
}
```

#### Session
```typescript
{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Checkpoint
```typescript
{
  id: string;
  sessionId: string;
  messageId: string;
  description: string;
  files: File[];
  createdAt: string;
}
```

#### AssistantPrompt
```typescript
{
  id: string;
  name: string;
  description: string;
  instructions: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# TypeScript type checking
npm run check

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:5000`

## 📖 Usage Guide

### Getting Started

1. **Start a New Chat**: Click "New Chat" in the sidebar to begin a conversation
2. **Upload Files**: Use the upload button to add code files for context
3. **Mention Files**: Type `@` in the chat input to reference uploaded files
4. **Get Suggestions**: Ask the AI for code reviews, explanations, or improvements
5. **Review Changes**: Preview proposed changes in the diff viewer
6. **Apply or Reject**: Apply changes to create a checkpoint, or reject them

### File Mentions

Reference files in your messages using `@` syntax:

```
@app.tsx can you add error handling to this component?
```

The AI will have access to the file content and can provide targeted suggestions.

### Custom Prompts

1. Click the **Settings** icon in the chat header
2. **Create Prompt**: Add a new custom prompt with instructions
3. **Set as Default**: Mark a prompt as default for all new chats
4. **Edit/Delete**: Modify or remove existing prompts

### Checkpoints & Rollback

- **Automatic Checkpoints**: Created when you apply changes
- **View History**: See all checkpoints in the sidebar
- **Restore State**: Click any checkpoint to restore files to that state
- **Diff Preview**: Review what changed between checkpoints

## 🎨 Design System

### Color Scheme
- **Dark Mode (Default)**: Professional dark theme with accent colors
- **Light Mode**: Clean, minimal light theme
- **Accent Colors**: Blue for primary actions, red for destructive actions

### Typography
- **Headings**: Inter or SF Pro (system font)
- **Body**: Inter or SF Pro
- **Code**: JetBrains Mono or Fira Code

### Layout
- **Sidebar**: Fixed width (320px) with collapsible trigger
- **Main Content**: Flexible split-pane layout
- **Chat Area**: Top 60% of main content
- **Code Viewer**: Bottom 40% (resizable)

## 🔌 API Endpoints

### Chat
- `POST /api/chat` - Send message and get AI response (streaming)

### Assistant Prompts
- `GET /api/assistant-prompts` - List all prompts
- `GET /api/assistant-prompts/default` - Get default prompt
- `GET /api/assistant-prompts/:id` - Get single prompt
- `POST /api/assistant-prompts` - Create new prompt
- `PATCH /api/assistant-prompts/:id` - Update prompt
- `POST /api/assistant-prompts/:id/set-default` - Set as default
- `DELETE /api/assistant-prompts/:id` - Delete prompt

### Files
- `GET /api/files` - List all files
- `POST /api/files` - Upload file
- `PATCH /api/files/:id` - Update file content
- `DELETE /api/files/:id` - Delete file

### Sessions
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create new session
- `DELETE /api/sessions/:id` - Delete session
- `GET /api/sessions/:id/messages` - Get session messages

### Checkpoints
- `GET /api/sessions/:id/checkpoints` - List checkpoints
- `POST /api/checkpoints` - Create checkpoint

## 🔐 Environment Variables

```bash
# OpenAI API Configuration (via Replit AI Integrations)
AI_INTEGRATIONS_OPENAI_API_KEY=your_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.replit.com/openai/v1

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

## 📦 Project Structure

```
assistant-revival/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   ├── pages/            # Page components
│   │   └── main.tsx          # Entry point
│   └── index.html
├── server/                    # Express backend
│   ├── routes.ts             # Main API routes
│   ├── storage.ts            # Storage layer
│   ├── db.ts                 # In-memory database
│   ├── index.ts              # Server entry point
│   └── replit_integrations/  # Replit-specific features
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Zod schemas
├── script/                    # Build scripts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🧪 Testing

The application includes comprehensive TypeScript type checking:

```bash
npm run check
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates:
- Client bundle in `dist/public/`
- Server bundle in `dist/index.cjs`

### Start Production Server

```bash
npm start
```

## 🎓 Key Design Decisions

### 1. **In-Memory Storage with Persistence**
The application uses in-memory storage by default, with localStorage persistence on the client. This provides:
- Fast performance for a single-user memorial edition
- No database setup required
- Automatic persistence across browser sessions

### 2. **SSE for Streaming**
Server-Sent Events (SSE) are used instead of WebSockets for simpler streaming implementation:
- Easier to implement and debug
- Works well for unidirectional streaming
- Better browser compatibility

### 3. **Component-Based UI**
Extensive use of shadcn/ui provides:
- Consistent, accessible components
- Easy customization through CSS variables
- Professional appearance out of the box

### 4. **Zustand for State Management**
Zustand was chosen for its:
- Minimal boilerplate
- Built-in persistence middleware
- Simple API for complex state

## 🤝 Contributing

This is a memorial edition preserved as-is. For enhancements or bug fixes:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

This project is a tribute to **Replit Assistant**, a tool that helped many developers with quick edits, code suggestions, and collaborative development. While Assistant has been deprecated, this memorial edition preserves its spirit and core functionality.

---

**Built with ❤️ as a memorial to Assistant**

*"A lightweight AI tool for chat and quick edits"*
