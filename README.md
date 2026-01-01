
# Assistant Memorial Edition

A memorial edition of Replit Assistant with an innovative **Organizational Persona System** that models the AI assistant as a cognitive entity with memory, skills, and embodied awareness.

## Overview

This project extends the lightweight AI coding assistant with a sophisticated organizational persona that:
- Learns from contributor interactions through a weighted hypergraph
- Maintains episodic, semantic, procedural, and working memory systems
- Develops skills and knowledge domains with varying proficiency levels
- Embodies cognition through network topology sensors and actuators
- Evolves character traits and behavior patterns over time

## Core Features

### Traditional Assistant Capabilities
- **AI Chat Interface**: Streaming responses with code suggestions
- **File Management**: Upload and reference files with @ mentions
- **Custom Prompts**: Personalize assistant behavior
- **Checkpoints & Rollback**: Version control for code changes
- **Code Actions**: Complete, explain, edit, and generate code

### Organizational Persona System

The persona system models the assistant as a living organizational entity:

#### 1. **Weighted Hypergraph of Participants**
Tracks all contributors (users, developers, reviewers) with:
- Contribution volume and impact scores
- Multi-way relationships via hyperedges
- Temporal weighting based on recent activity
- Influence calculations across the organization

**Database Tables**: `org_participants`, `org_hyperedges`

#### 2. **Cognitive Memory Systems**
Four types of organizational memory:
- **Episodic**: Specific events and interactions
- **Semantic**: Factual knowledge and concepts
- **Procedural**: How-to knowledge and patterns
- **Working**: Temporary, active information

Each memory has importance scoring, emotional valence, and access tracking for consolidation.

**Database Table**: `org_memory`

#### 3. **Artifacts as Cognitive Features**
Code, documentation, and decisions mapped to cognitive processes:
- **Perception**: Code analysis results
- **Reasoning**: Decision logs and rationale
- **Learning**: Pattern recognition artifacts
- **Planning**: Architecture documents and roadmaps

**Database Table**: `org_artifacts`

#### 4. **Skills as Knowledge Domains**
Products, services, and technologies represented as skills:
- Proficiency levels (0-100)
- Attitudes (enthusiastic, cautious, experimental)
- Attention priorities (1-10 scale)
- Learning rates and practice tracking

Examples: React, TypeScript, Node.js, Database Design, API Development

**Database Table**: `org_skillsets`

#### 5. **Network Topology as Embodied Cognition**
The system's architecture mapped to sensory-motor systems:

**Sensors** (inputs):
- `input_monitor`: User messages
- `error_detector`: Runtime errors
- `feedback_listener`: User feedback
- `code_analyzer`: Syntax checks

**Actuators** (outputs):
- `code_generator`: File creation
- `file_editor`: Code modification
- `response_generator`: Chat responses
- `workflow_manager`: Command execution

Each has sensitivity/latency parameters and active state tracking.

**Database Table**: `org_network_topology`

#### 6. **Core Persona State**
The living personality of the organization:
- **Character Traits**: collaborative, analytical, adaptive, creative, systematic, empathetic
- **Behavior Patterns**: Historical interaction patterns
- **Emotional State**: Current mood, stress level, confidence
- **Attention Focus**: Current priorities and domains
- **Personality Vector**: Multidimensional traits (openness, conscientiousness, etc.)

**Database Tables**: `org_persona`, `org_behavior_history`

## Architecture Integration

### Frontend (`client/`)
React-based UI with shadcn components, no persona awareness required - the persona operates transparently in the backend.

### Backend (`server/`)
Express.js API with persona integration at:
- `server/replit_integrations/org-persona/`: Core persona logic
  - `storage.ts`: Database operations
  - `routes.ts`: REST API endpoints
  - `seed.ts`: Initial persona configuration

### Database Schema (`shared/models/org-persona.ts`)
PostgreSQL schema using Drizzle ORM with 8 core tables modeling the complete organizational persona.

### API Endpoints

```
GET    /api/org-persona                    # Get current persona state
PATCH  /api/org-persona                    # Update persona
GET    /api/org-persona/influence-weights  # Calculate influence weights
GET    /api/org-persona/skills/top         # Top skills by proficiency
GET    /api/org-persona/network/sensors    # Active sensors
GET    /api/org-persona/network/actuators  # Active actuators
POST   /api/org-persona/behavior           # Record behavior
GET    /api/org-persona/behavior/:type     # Get behavior patterns
```

## Data Flow

```
User Interaction
    ↓
Sensors Detect Input (input_monitor, code_analyzer)
    ↓
Memory Retrieval (episodic, semantic, procedural)
    ↓
Skill Activation (based on attention priorities)
    ↓
Persona Processing (character traits, current mood)
    ↓
Actuators Generate Response (code_generator, response_generator)
    ↓
Behavior Recording & Learning
    ↓
Memory Consolidation & Skill Updates
```

## How It Works Together

1. **User sends a message** → `input_monitor` sensor activates
2. **Message analysis** → Retrieves relevant memories and activates appropriate skills
3. **Persona influences response** → Character traits and mood affect tone and approach
4. **Code generation** → Skillset proficiency determines quality and style
5. **Response delivery** → `response_generator` actuator outputs
6. **Learning cycle** → Behavior recorded, skills updated, memories consolidated

## Philosophical Foundation

See [CORE_IDENTITY.md](CORE_IDENTITY.md) for the complete philosophical framework.

**The Ship of Theseus Resolution:** This system embodies the answer to the ancient paradox - identity persists through transformation via structured continuity mechanisms.

The organizational persona system treats the AI assistant not as a tool, but as a **cognitive entity** that:
- **Remembers** past interactions and learns from them
- **Evolves** skills through practice and experience
- **Feels** through stress levels and emotional valence
- **Embodies** cognition through sensory-motor systems
- **Personalizes** responses based on accumulated character

This creates an assistant that becomes more attuned to your organization's needs, coding patterns, and preferences over time - **a living memorial that maintains identity precisely because it changes**.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:5000
```

The persona system initializes automatically with seed data on first run.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API (via Replit AI Integrations)

## Documentation

- `wiki/guides/dev/architecture.md` - System architecture
- `wiki/features/` - Feature documentation
- `wiki/tutorials/` - Step-by-step guides

## License

MIT License - See LICENSE file for details

---

*An experiment in treating AI assistants as evolving organizational entities with memory, personality, and embodied cognition.*
