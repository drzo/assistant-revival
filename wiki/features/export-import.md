
# Export & Import

## Overview
Export conversations, files, and checkpoints for backup, sharing, or importing into other sessions.

## Export Features

### 1. Conversation Export
- **Format Options**: JSON, Markdown, HTML, PDF
- **Complete History**: All messages and metadata
- **File Attachments**: Include referenced files
- **Checkpoint Data**: Export with rollback points

### 2. File Export
- **Bulk Download**: Export multiple files at once
- **Archive Format**: ZIP or TAR archives
- **Metadata Preservation**: Keep file information
- **Selective Export**: Choose specific files

### 3. Project Export
- **Full Workspace**: Export entire project state
- **Configuration**: Include settings and prompts
- **History Bundle**: All conversations and files
- **Reproducible State**: Everything needed to restore

## Import Features

### 1. Conversation Import
- **Format Detection**: Auto-detect export format
- **Merge Options**: Append or replace conversations
- **Validation**: Check data integrity
- **Conflict Resolution**: Handle duplicate IDs

### 2. File Import
- **Drag & Drop**: Import from archive files
- **Batch Upload**: Multiple files at once
- **Metadata Restore**: Preserve original timestamps
- **Language Detection**: Auto-detect file types

### 3. Configuration Import
- **Settings Transfer**: Import user preferences
- **Prompt Templates**: Share custom prompts
- **Checkpoint Restore**: Import rollback points

## Technical Implementation

### Export Format (JSON)
```typescript
interface ExportData {
  version: string;
  exportDate: string;
  conversations: Conversation[];
  files: File[];
  checkpoints: Checkpoint[];
  settings: UserSettings;
}
```

### Markdown Export
```markdown
# Conversation: [Title]
Exported: [Date]

## Message 1
**User** ([Timestamp])
Message content...

**Assistant** ([Timestamp])
Response content...

### Mentioned Files
- filename.ts (123 bytes)
```

### HTML Export
- Styled conversation view
- Syntax-highlighted code blocks
- Embedded file previews
- Print-friendly layout

## Use Cases

### 1. Backup & Archive
- Regular conversation backups
- Project snapshots
- Compliance and audit trails
- Long-term storage

### 2. Sharing & Collaboration
- Share problem-solving sessions
- Export examples for documentation
- Collaborate across teams
- Template sharing

### 3. Migration
- Move between instances
- Transfer to different devices
- Upgrade between versions
- Disaster recovery

## Security & Privacy

### Export Controls
- Sensitive data warnings
- API key redaction
- Personal info filtering
- Encryption options

### Import Validation
- Schema validation
- Malware scanning
- Size limits
- Content sanitization

## Integration

### UI Components
- Export button in conversation menu
- Import option in sidebar
- Drag & drop zone
- Progress indicators

### Batch Operations
- Export multiple conversations
- Schedule automatic exports
- Incremental backups
- Compression options

## File Formats

### Supported Exports
- `.json`: Full data export
- `.md`: Markdown conversation
- `.html`: Styled HTML view
- `.pdf`: Printable document
- `.zip`: Archive with files

### Import Compatibility
- Legacy format support
- Cross-platform compatibility
- Version migration
- Format conversion
