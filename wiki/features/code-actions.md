
# Code Actions

## Overview
The Code Actions system enables the AI assistant to propose and execute code changes, shell commands, and package installations.

## Key Features

### 1. File Edits
- **Multi-file Support**: Edit multiple files in one response
- **Diff Preview**: Visual before/after comparison
- **Line Stats**: Show added/removed line counts
- **Apply Changes**: Automatic or manual application

### 2. Shell Commands
- **Command Proposals**: AI suggests shell commands
- **Visual Cards**: Commands displayed in action cards
- **Copy to Execute**: One-click command copying
- **Safety Warnings**: Dangerous commands flagged

### 3. Package Installation
- **Auto-detect Dependencies**: Identify needed packages
- **NPM Integration**: Suggest `npm install` commands
- **Multiple Packages**: Install several packages at once
- **Version Support**: Specify package versions

## Technical Implementation

### Message Metadata
```typescript
interface Message {
  metadata?: {
    shellCommands?: string[];
    fileEdits?: Array<{
      file: string;
      added: number;
      removed: number;
    }>;
  };
}
```

### Command Parsing
```typescript
// Parse shell commands from AI response
const shellMatch = buffer.match(/SHELL_COMMAND:\s*(.+)/g);
if (shellMatch) {
  shellMatch.forEach(match => {
    const cmd = match.replace(/SHELL_COMMAND:\s*/, "").trim();
    shellCommands.push(cmd);
  });
}
```

### File Edit Format
```
FILE_EDIT: filename.ext | +lines -lines
```

## Action Types

### 1. File Edit Actions
**Format**: `FILE_EDIT: path/to/file.ts | +5 -2`

**Example**:
```
FILE_EDIT: server/index.ts | +12 -3
Added error handling middleware
```

### 2. Shell Command Actions
**Format**: `SHELL_COMMAND: command here`

**Example**:
```
SHELL_COMMAND: npm run build
SHELL_COMMAND: node scripts/migrate.js
```

### 3. Package Install Actions
**Format**: `INSTALL_PACKAGE: package-name`

**Example**:
```
INSTALL_PACKAGE: express
INSTALL_PACKAGE: @types/node
```

## UI Components

### Command Cards
- Terminal icon indicator
- Monospace font for commands
- Play button for execution
- Copy button for clipboard

### File Edit Cards
- File icon indicator
- File path display
- +/- line statistics
- Color-coded changes (green/red)

## Usage

### Requesting Code Changes
```
User: Add error handling to the login function
Assistant: I'll add try-catch blocks to handle errors:

FILE_EDIT: auth/login.ts | +8 -2
```

### Installing Dependencies
```
User: I need to use axios for HTTP requests
Assistant: Let's install axios:

INSTALL_PACKAGE: axios
INSTALL_PACKAGE: @types/axios
```

### Running Commands
```
User: How do I build the project?
Assistant: Run the build command:

SHELL_COMMAND: npm run build
```

## Safety Features

### Dangerous Commands
Commands flagged as dangerous:
- `rm -rf`
- `sudo` operations
- File deletions
- Process killing

### Confirmation Required
- Manual approval for dangerous operations
- Visual warning indicators
- Explicit user consent

## Auto-apply Settings

### Configuration
- Enable/disable auto-apply in settings
- Applies to file edits only
- Shell commands always manual
- Workflow restart control
