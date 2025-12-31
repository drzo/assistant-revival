# Assistant Memorial Edition

## Overview

This is a memorial edition of Replit Assistant - a lightweight AI-powered coding assistant tool. The application provides a chat interface where users can upload code files, mention them with @ syntax, and receive AI-powered code suggestions and explanations. Key features include file uploads, AI chat with streaming responses, code diff viewing, checkpoint/rollback functionality, and a split-pane layout with sidebar navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter (lightweight React router)
- **State Management**: Zustand with persistence middleware for client-side state
- **Data Fetching**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming (light/dark mode)
- **Layout**: Resizable split-pane layout using react-resizable-panels

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with tsx for development
- **API Pattern**: RESTful endpoints with SSE (Server-Sent Events) for streaming chat responses
- **Build**: esbuild for production bundling with selective dependency bundling for cold start optimization

### Data Storage
- **Primary Storage**: PostgreSQL via Drizzle ORM (configured but with in-memory fallback)
- **Schema Location**: `shared/schema.ts` defines entities using Zod for validation
- **Session Storage**: In-memory storage implementation in `server/storage.ts` for sessions, messages, files, and checkpoints
- **Client Persistence**: Zustand persist middleware stores state in localStorage

### AI Integration
- **Provider**: OpenAI API (via Replit AI Integrations)
- **Features**: Chat completions with streaming, image generation capabilities
- **Batch Processing**: Custom utilities for rate-limited batch operations with retries

### Key Design Decisions

1. **Shared Schema Pattern**: Types and schemas defined in `shared/` directory are used by both client and server, ensuring type safety across the stack.

2. **In-Memory Storage with Database Ready**: The application uses in-memory storage by default but has Drizzle ORM configured for PostgreSQL, allowing easy migration to persistent storage.

3. **SSE for Streaming**: Chat responses use Server-Sent Events rather than WebSockets for simpler streaming implementation.

4. **Component-Based UI**: Extensive use of shadcn/ui provides consistent, accessible components with easy customization through CSS variables.

## External Dependencies

### AI Services
- **OpenAI API**: Used for chat completions and image generation
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Accessed via Replit AI Integrations

### Database
- **PostgreSQL**: Primary database (when provisioned)
  - Environment variable: `DATABASE_URL`
  - ORM: Drizzle with drizzle-kit for migrations
  - Session storage: connect-pg-simple for Express sessions

### Third-Party Libraries
- **Radix UI**: Accessible component primitives
- **Embla Carousel**: Carousel functionality
- **react-day-picker**: Calendar/date picker
- **react-resizable-panels**: Resizable panel layouts
- **Vaul**: Drawer component
- **p-limit/p-retry**: Batch processing utilities

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)