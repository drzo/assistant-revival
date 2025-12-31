# Design Guidelines: Assistant Memorial Edition

## Design Approach

**Selected Framework:** Hybrid approach inspired by modern developer tools (Linear, Notion, GitHub Copilot) with Material Design principles for component consistency.

**Core Philosophy:** Create a clean, efficient workspace that honors Assistant's lightweight nature while providing a polished, professional coding environment. The interface should feel like a preserved artifact - timeless, functional, and respectful of the original tool's purpose.

## Typography

**Font Stack:**
- Interface: Inter or SF Pro for clean, modern UI text
- Code: JetBrains Mono or Fira Code for monospaced content
- CDN: Google Fonts

**Hierarchy:**
- Large headings (page titles): text-2xl font-semibold
- Section headers: text-lg font-medium  
- Body text: text-base font-normal
- Code/technical: text-sm font-mono
- Metadata/timestamps: text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 for consistent rhythm
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4 (between related elements)
- Generous spacing: p-8, gap-8 (between sections)

**Layout Structure:**
- Split-pane layout: Sidebar (320px fixed) + Main content (flex-1)
- Sidebar: File browser, session history, settings
- Main: Chat interface (top 60%) + Code/Diff viewer (bottom 40%, resizable)
- Mobile: Stack vertically with collapsible sidebar

**Container Constraints:**
- Chat messages: max-w-4xl mx-auto
- Code blocks: Full width within container
- File list items: Full width with padding

## Component Library

### Navigation & Sidebar
- Collapsible file tree with folder icons
- Session history list with timestamps
- Upload button (prominent, top of sidebar)
- Settings icon (bottom of sidebar)

### Chat Interface
**Message Bubbles:**
- User messages: Align right, compact styling
- AI responses: Align left, generous spacing for readability  
- File mentions: Inline badges with @ prefix, pill-shaped
- Timestamp: Small text below each message

**Input Area:**
- Multi-line textarea (min-h-20, max-h-40)
- File mention autocomplete dropdown
- Send button with keyboard hint (⌘↵)
- Attachment icon for file uploads

### Code Display & Diff Viewer
**Code Blocks:**
- Monaco Editor integration (read-only for context)
- Line numbers, syntax highlighting
- File path header with copy button
- Minimum height: h-64

**Diff Preview:**
- Side-by-side view (2 columns on desktop)
- Unified view (stacked on mobile)
- Color indicators for additions/deletions (semantic, not literal colors)
- Line-by-line comparison with clear markers

### File Management
**File Cards:**
- Icon + filename + size
- Remove button (×) on hover
- Active state when mentioned in chat
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### Action Controls
**Button Hierarchy:**
- Primary: "Apply Changes" (solid, prominent)
- Secondary: "Preview Diff" (outlined)
- Danger: "Rollback" (outlined, warning state)
- Ghost: "Cancel", "Close" (minimal)

**Checkpoint System:**
- Timeline view with dots/lines
- Each checkpoint: timestamp + short description
- Current state highlighted
- Click to preview/restore

## Interaction Patterns

**Minimal Animations:**
- Smooth transitions on panel resize (transition-all duration-200)
- Subtle fade-in for new messages (animate-fade-in)
- No scroll-based or decorative animations

**States:**
- Loading: Subtle spinner in chat area
- Empty states: Friendly illustrations + onboarding text
- Error states: Inline messages with retry actions

**Responsive Behavior:**
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Mobile: Single column, hamburger sidebar toggle
- Tablet: Reduced sidebar width (240px)
- Desktop: Full split-pane experience

## Page Structure

**Single-Page Application:**
- No hero section (utility app, not marketing)
- Immediate access to chat interface
- Persistent sidebar navigation
- Modal overlays for settings/help

**Key Areas:**
1. **Header Bar** (h-14): Logo/title, session name, user menu
2. **Sidebar** (w-80): File browser, history, controls
3. **Main Chat** (flex-1): Conversation thread, input
4. **Code Pane** (resizable): Context files, diff previews
5. **Footer** (h-10): Status indicators, credit usage display

## Images & Assets

**Icons:** Heroicons (outline style for consistency)
- File types: Document, Code, Folder icons
- Actions: Send, Upload, Settings, Close, Expand
- States: Check, X, Clock, Alert

**No Hero Image:** This is a tool interface, not a landing page. Focus on immediate functionality.

**Illustrations:** Use minimal, line-art style for empty states only
- Empty chat: Simple code bracket illustration
- No files: Folder + upload icon
- Error: Alert icon with friendly message

## Accessibility

- Keyboard navigation: Tab through all interactive elements
- Focus indicators: Clear ring outline on focused elements
- ARIA labels: All buttons and controls properly labeled
- Screen reader support: Meaningful alt text, semantic HTML
- Color contrast: Ensure text meets WCAG AA standards (though colors not specified here)

## Technical Notes

- Code syntax highlighting via Monaco or Prism.js
- Diff rendering via react-diff-viewer or similar
- File upload via drag-and-drop + click
- Responsive text sizing (rem units)
- Optimized for Chrome/Firefox/Safari