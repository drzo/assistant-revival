
# Checkpoints & Rollback

## What are Checkpoints?

Checkpoints are snapshots of your conversation and file state at a specific point in time. They let you save your progress and return to it later if needed.

## Why Use Checkpoints?

### Safety Net
- Experiment freely without fear of losing work
- Try risky changes with an easy way back
- Protect against accidental deletions

### Experimentation
- Test multiple approaches
- Compare different solutions
- Learn from trial and error

### Collaboration
- Share stable states with teammates
- Document working configurations
- Track decision points

## Creating Checkpoints

### Automatic Checkpoints
The system may create checkpoints automatically at key moments:
- Before major code changes
- After successful feature completion
- At conversation milestones

### Manual Checkpoints
Create your own checkpoints when:
- You've reached a working state
- Before trying something experimental
- After completing a feature
- Before major refactoring

**How to Create:**
1. Look for the checkpoint button in the sidebar
2. Click "Create Checkpoint"
3. Add a descriptive name (optional)
4. Checkpoint is saved with timestamp

## Using Checkpoints

### Viewing Checkpoints
1. Open the checkpoints panel in the sidebar
2. See a timeline of all saved checkpoints
3. Each shows timestamp and description
4. Hover to see file list at that point

### Restoring a Checkpoint
When you need to go back:
1. Find the checkpoint you want
2. Click "Restore" or "Rollback"
3. Confirm the action
4. Your conversation and files revert to that state

**Warning**: Restoring a checkpoint will:
- Replace current files with checkpoint versions
- Clear conversation history after that point
- Cannot be undone (unless you create a checkpoint first!)

## Best Practices

### Naming Checkpoints
Be descriptive for easy identification:
- ✅ "Working authentication before API changes"
- ✅ "Clean state before database migration"
- ❌ "Checkpoint 1"
- ❌ "Backup"

### When to Create Checkpoints

**Good Times:**
- Right before refactoring
- After tests pass
- Before experimental features
- End of work session

**Less Useful:**
- Every single message
- During active debugging
- When nothing has changed

### Managing Checkpoints

- Keep 5-10 meaningful checkpoints
- Delete old ones you won't need
- Create a checkpoint before deleting others
- Name them clearly for future you

## Common Workflows

### Safe Experimentation
```
1. Create checkpoint: "Before trying new approach"
2. Experiment with changes
3. If it works: Create "Working solution"
4. If it fails: Restore previous checkpoint
```

### Feature Development
```
1. Create checkpoint: "Clean starting point"
2. Develop feature
3. Create checkpoint: "Feature complete"
4. Test and refine
5. Create checkpoint: "Tested and working"
```

### Learning Mode
```
1. Create checkpoint at working code
2. Try modifications to learn
3. Break things intentionally
4. Restore checkpoint
5. Try again with new knowledge
```

## Troubleshooting

### Can't Restore Checkpoint
- Ensure you have permission
- Check if checkpoint still exists
- Try refreshing the page

### Lost Checkpoint
- Checkpoints are session-scoped by default
- May be cleared on page reload (unless DB is configured)
- Create important checkpoints near end of session

### Checkpoint Doesn't Match
- Files may have changed between sessions
- Check the timestamp carefully
- Verify it's the checkpoint you intended

## Advanced Tips

1. **Double-Checkpoint**: Create a checkpoint before restoring another
2. **Descriptive Names**: Include what works at this point
3. **Regular Saves**: Like saving a document, checkpoint regularly
4. **Experiment Branch**: Create checkpoint, try crazy ideas, restore if needed
5. **Pre-Deployment**: Always checkpoint before deploying changes
