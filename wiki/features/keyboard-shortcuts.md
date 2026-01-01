
# Keyboard Shortcuts

## Overview
Comprehensive keyboard shortcuts for efficient navigation and interaction without mouse usage.

## Navigation Shortcuts

### Chat Interface
- **Cmd/Ctrl + Enter**: Send message
- **Cmd/Ctrl + K**: Focus message input
- **Esc**: Unfocus input, close dialogs
- **↑/↓**: Navigate message history
- **Cmd/Ctrl + /**: Toggle keyboard shortcuts help

### File Management
- **Cmd/Ctrl + O**: Open file picker
- **Cmd/Ctrl + U**: Upload files
- **Cmd/Ctrl + F**: Search files
- **Del/Backspace**: Delete selected file

### Sidebar
- **Cmd/Ctrl + B**: Toggle sidebar
- **Cmd/Ctrl + Shift + F**: Toggle file panel
- **Cmd/Ctrl + Shift + H**: Toggle history panel

## Editor Shortcuts

### Code Viewer
- **Cmd/Ctrl + C**: Copy code block
- **Cmd/Ctrl + A**: Select all
- **Cmd/Ctrl + F**: Find in file
- **Cmd/Ctrl + G**: Go to line

### Diff Viewer
- **n**: Next change
- **p**: Previous change
- **a**: Accept change
- **r**: Reject change

## Conversation Management

### Actions
- **Cmd/Ctrl + N**: New conversation
- **Cmd/Ctrl + S**: Save conversation
- **Cmd/Ctrl + E**: Export conversation
- **Cmd/Ctrl + Delete**: Delete conversation

### Checkpoints
- **Cmd/Ctrl + Z**: Create checkpoint
- **Cmd/Ctrl + Shift + Z**: Restore checkpoint
- **Cmd/Ctrl + Y**: View checkpoint history

## Accessibility

### Focus Management
- **Tab**: Next focusable element
- **Shift + Tab**: Previous focusable element
- **Enter**: Activate button/link
- **Space**: Toggle checkbox/switch

### Screen Reader
- All shortcuts announced to screen readers
- ARIA labels on all interactive elements
- Keyboard-only navigation supported

## Technical Implementation

### Shortcut Handler
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    
    if (isCmdOrCtrl && e.key === 'Enter') {
      handleSendMessage();
    }
    // ... more shortcuts
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Customization
```typescript
interface ShortcutConfig {
  key: string;
  modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: () => void;
  description: string;
}
```

## Help Overlay

### Display
- Press **Cmd/Ctrl + /** to show
- Searchable shortcut list
- Categorized by feature area
- Visual key representations

### Content
- All available shortcuts
- Context-sensitive suggestions
- Platform-specific variations (Mac/Windows/Linux)
