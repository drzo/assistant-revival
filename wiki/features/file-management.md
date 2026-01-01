
# File Management

## Overview
The file management system allows users to upload, view, and reference code files within the assistant workspace.

## Key Features

### 1. File Upload
- **Drag & Drop**: Drag files into the upload zone
- **Click to Browse**: Traditional file picker dialog
- **Multiple Files**: Upload multiple files simultaneously
- **Size Display**: Show file sizes
- **Language Detection**: Automatic language identification

### 2. File Viewer
- **Syntax Highlighting**: Code displayed with proper formatting
- **Read-only Mode**: Monaco Editor integration
- **Line Numbers**: Easy navigation
- **Copy Support**: Copy entire file content

### 3. File Storage
- **In-Memory**: Fast access during session
- **Database Ready**: PostgreSQL schema available
- **Metadata Tracking**: Name, size, language, timestamps

### 4. File Context
- **@ Mention Support**: Reference files in chat
- **Autocomplete**: Suggestions while typing @
- **Visual Cards**: File chips in messages
- **Click to View**: Open file viewer from mentions

## Technical Implementation

### File Schema
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

### Storage Pattern
```typescript
// In-memory storage
files: Map<string, File> = new Map();

// Upload file
uploadFile(file: InsertFile): File {
  const id = generateId();
  const newFile = { ...file, id, uploadedAt: new Date().toISOString() };
  this.files.set(id, newFile);
  return newFile;
}
```

### Components
- **FileUpload**: Drag-drop and browse interface
- **FileCard**: File display card with actions
- **FileViewer**: Monaco-based code viewer
- **FileContext**: File mention system

## File Language Detection

Supported languages:
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- HTML (.html)
- CSS (.css)
- JSON (.json)
- Markdown (.md)
- And more...

## Usage

### Uploading Files
1. Click "Upload Files" in sidebar
2. Drag files or click to browse
3. Files appear in file list
4. Files available for @ mention

### Viewing Files
1. Click file card in sidebar
2. Or click file mention in message
3. File opens in viewer pane
4. View with syntax highlighting

### Mentioning in Chat
```
@server.ts has a bug in the authentication logic
```

## File Actions

### Remove File
- Click X on file card
- Confirms deletion
- Removes from storage
- Updates all references

### View Content
- Click file card or mention
- Opens in viewer pane
- Syntax highlighted
- Read-only display
