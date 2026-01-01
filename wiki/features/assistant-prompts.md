
# Assistant Prompts

## Overview
The Assistant Prompts system allows users to customize the AI assistant's behavior by creating, managing, and selecting custom instruction sets. This feature enables personalized responses and specialized workflows.

## Key Features

### 1. Custom Prompt Creation
- **Name & Instructions**: Define a name and detailed instructions for the assistant to follow
- **Persistent Storage**: Prompts are stored in PostgreSQL database
- **Reusable**: Create once, use across multiple conversations

### 2. Prompt Management
- **Create New Prompts**: Add custom instructions through the Prompt Manager UI
- **Edit Existing**: Update prompt instructions and names
- **Delete**: Remove prompts that are no longer needed
- **Set Default**: Mark a prompt as default for automatic selection

### 3. Prompt Selection
- **Dropdown Selector**: Quick selection from available prompts
- **Active Indicator**: Visual feedback showing which prompt is currently active
- **Per-Conversation**: Select different prompts for different conversations

## Technical Implementation

### Database Schema
```sql
assistant_prompts (
  id: serial PRIMARY KEY,
  name: text NOT NULL,
  instructions: text NOT NULL,
  is_default: boolean DEFAULT false,
  created_at: timestamp,
  updated_at: timestamp
)
```

### API Endpoints
- `GET /api/assistant-prompts` - Fetch all prompts
- `POST /api/assistant-prompts` - Create new prompt
- `PATCH /api/assistant-prompts/:id` - Update prompt
- `DELETE /api/assistant-prompts/:id` - Delete prompt
- `POST /api/assistant-prompts/:id/set-default` - Set as default

### Components
- **PromptSelector**: Dropdown for selecting active prompt
- **PromptManager**: Modal dialog for CRUD operations
- **ChatContainer**: Integrates prompt selection with message sending

## Usage

### Creating a Custom Prompt
1. Click the settings icon next to the prompt selector
2. Click "Create Prompt" button
3. Enter prompt name and instructions
4. Save the prompt

### Using a Prompt
1. Select a prompt from the dropdown in the chat header
2. Send messages - they will include the prompt's instructions
3. The assistant will follow the selected prompt's guidelines

## Example Prompts

**Detailed Explainer**
```
Instructions: Always provide comprehensive, step-by-step explanations. 
Include code examples, potential pitfalls, and best practices.
```

**Quick Fixer**
```
Instructions: Focus on concise, actionable solutions. 
Propose minimal code changes to fix issues quickly.
```

**Code Reviewer**
```
Instructions: Review code for best practices, performance, 
security issues, and maintainability. Suggest improvements.
```
