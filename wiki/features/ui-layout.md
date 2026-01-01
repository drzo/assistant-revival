
# UI Layout and Design

## Overview
The Assistant Memorial Edition features a modern, split-pane interface inspired by developer tools like Linear, Notion, and GitHub Copilot.

## Layout Structure

### 1. Resizable Split-Pane
- **Sidebar (320px)**: File browser and navigation
- **Main Content (flex-1)**: Chat interface
- **Code Pane (40%)**: File viewer and diffs
- **Resizable Handles**: Drag to adjust sizes

### 2. Responsive Design
- **Mobile (<768px)**: Stacked vertical layout
- **Tablet (768-1024px)**: Reduced sidebar (240px)
- **Desktop (>1024px)**: Full split-pane experience

### 3. Component Areas
- **Header Bar (h-14)**: Title and user controls
- **Sidebar**: Tabs for files, history, settings
- **Chat Area**: Message thread + input
- **Code Viewer**: Monaco editor integration
- **Footer**: Status indicators

## Design System

### Typography
**Font Stack**:
- Interface: Inter (via Google Fonts)
- Code: JetBrains Mono
- Fallbacks: system fonts

**Hierarchy**:
- `text-2xl font-semibold`: Page titles
- `text-lg font-medium`: Section headers
- `text-base font-normal`: Body text
- `text-sm font-mono`: Code/technical
- `text-xs`: Metadata/timestamps

### Spacing
- Tight: `p-2`, `gap-2` (component internals)
- Standard: `p-4`, `gap-4` (between elements)
- Generous: `p-8`, `gap-8` (between sections)

### Color System
- **CSS Variables**: Theme-based colors
- **Light/Dark Mode**: Automatic switching
- **Semantic Colors**: chart-1 through chart-5
- **State Colors**: muted, accent, destructive

## Component Library

### shadcn/ui Components
- Accordion, Alert, Badge, Button
- Card, Carousel, Chart, Checkbox
- Dialog, Drawer, Dropdown, Form
- Input, Label, Popover, Progress
- ScrollArea, Select, Sheet, Sidebar
- Slider, Switch, Table, Tabs
- Textarea, Toast, Tooltip

### Custom Components
- ChatContainer, ChatMessage, ChatInput
- FileCard, FileUpload, FileViewer
- CheckpointList, DiffViewer
- PromptSelector, PromptManager

## Interaction Patterns

### Minimal Animations
- `transition-all duration-200`: Panel resize
- `animate-fade-in`: New messages
- No scroll-based animations
- No decorative effects

### States
- **Loading**: Subtle spinner
- **Empty**: Friendly illustrations
- **Error**: Inline messages with retry
- **Success**: Toast notifications

### Keyboard Navigation
- Tab through interactive elements
- Focus indicators (ring outline)
- Keyboard shortcuts supported
- Enter to send messages

## Panel System

### react-resizable-panels
```typescript
<PanelGroup direction="horizontal">
  <Panel defaultSize={25} minSize={20}>
    <Sidebar />
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={75}>
    <MainContent />
  </Panel>
</PanelGroup>
```

### Persistence
- Panel sizes saved to localStorage
- Restored on page load
- User preferences maintained

## Theme System

### CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Theme Toggle
- Light/Dark mode switch
- System preference detection
- Persistent selection
- Smooth transitions

## Accessibility

### WCAG AA Compliance
- Color contrast ratios met
- Focus indicators visible
- Keyboard navigation complete
- Screen reader support

### ARIA Labels
- All interactive elements labeled
- Semantic HTML structure
- Alt text for images
- Role attributes

### Responsive Text
- `rem` units for sizing
- Scalable without breaking
- Readable at all sizes
- Mobile-optimized

## Icons

### Lucide React
- Outline style consistency
- 16px and 24px sizes
- Semantic usage
- Accessible labels

**Common Icons**:
- MessageSquare: Chat
- FileCode2: Code files
- Terminal: Shell commands
- Settings: Configuration
- Plus: Create actions
- Trash: Delete actions
