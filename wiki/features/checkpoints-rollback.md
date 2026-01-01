
# Checkpoints and Rollback

## Overview
The checkpoint system provides version control for your codebase, allowing you to save states and rollback changes at any point in your conversation.

## Key Features

### 1. Automatic Checkpoints
- **Message-based**: Created after significant changes
- **File Snapshots**: Complete file state preservation
- **Timestamps**: Track when checkpoints were created
- **Descriptions**: Meaningful labels for each checkpoint

### 2. Manual Checkpoints
- **User-initiated**: Create checkpoints on demand
- **Custom Descriptions**: Add your own labels
- **Strategic Saves**: Before risky operations

### 3. Rollback Functionality
- **Preview Changes**: See what will change
- **Diff View**: Compare current vs checkpoint state
- **One-click Restore**: Instant rollback
- **Multiple Checkpoints**: Choose from history

### 4. Timeline View
- **Chronological Display**: See checkpoint history
- **Visual Indicators**: Current state highlighted
- **Quick Navigation**: Jump to any checkpoint

## Technical Implementation

### Checkpoint Schema
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

### Storage Pattern
```typescript
createCheckpoint(checkpoint: InsertCheckpoint): Checkpoint {
  const id = generateId();
  const newCheckpoint = {
    ...checkpoint,
    id,
    createdAt: new Date().toISOString()
  };
  this.checkpoints.set(id, newCheckpoint);
  return newCheckpoint;
}
```

### Components
- **CheckpointList**: Timeline display
- **DiffViewer**: Side-by-side comparison
- **RollbackButton**: Restore action

## Checkpoint Creation

### Automatic Triggers
1. Before applying code changes
2. After successful file edits
3. Before package installations
4. At major conversation milestones

### Manual Creation
```typescript
// User clicks "Create Checkpoint"
const checkpoint = {
  sessionId: currentSessionId,
  messageId: lastMessageId,
  description: "Before refactoring auth system",
  files: currentFiles
};
```

## Rollback Process

### Preview Rollback
1. Select checkpoint from timeline
2. View diff of changes
3. Review what will change
4. Confirm or cancel

### Execute Rollback
```typescript
restoreCheckpoint(checkpointId: string) {
  const checkpoint = getCheckpoint(checkpointId);
  const filesSnapshot = checkpoint.files;
  replaceCurrentFiles(filesSnapshot);
  createAutoCheckpoint("Rollback to " + checkpoint.description);
}
```

## Diff Viewer

### Visual Comparison
- **Side-by-side**: Current vs Checkpoint
- **Unified View**: Mobile-friendly
- **Syntax Highlighting**: Language-aware
- **Line Numbers**: Easy reference

### Color Coding
- Green: Added lines
- Red: Removed lines
- Gray: Unchanged context

## Usage

### Creating a Checkpoint
1. Click "Create Checkpoint" button
2. Enter description
3. Checkpoint saved with current file state

### Rolling Back
1. Open checkpoint timeline
2. Select desired checkpoint
3. Preview changes in diff viewer
4. Click "Restore" to rollback

### Viewing Checkpoint Details
- Click checkpoint in timeline
- See file list at that point
- View timestamp and description
- Compare with current state

## Best Practices

### When to Create Checkpoints
- Before major refactoring
- After completing a feature
- Before experimental changes
- At working states

### Checkpoint Naming
- Be descriptive: "Added user authentication"
- Include context: "Before API migration"
- Avoid generic: Use specific names
- Date important: "Pre-deployment state"

## Storage Considerations

### In-Memory Storage
- Fast access
- Session-scoped
- Lost on reload

### Database Storage (Available)
- Persistent
- Cross-session
- Historical tracking
- Requires DATABASE_URL
