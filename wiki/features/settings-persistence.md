
# Settings & Persistence

## Overview
User preferences and application settings that persist across sessions, with both local and server-side storage options.

## Settings Categories

### 1. User Preferences
- **Theme**: Light, dark, or system theme
- **Language**: Interface language
- **Notifications**: Enable/disable notifications
- **Auto-save**: Automatic conversation saving

### 2. Editor Settings
- **Font Size**: Code editor font size
- **Tab Size**: Indentation width
- **Line Wrap**: Enable/disable line wrapping
- **Theme**: Editor color scheme

### 3. AI Behavior
- **Model Selection**: Choose AI model
- **Temperature**: Response creativity level
- **Max Tokens**: Response length limit
- **System Prompt**: Custom instructions

### 4. Interface Layout
- **Sidebar Width**: Adjustable panel sizes
- **Split Pane**: Horizontal/vertical split
- **Density**: Compact or comfortable spacing
- **Show/Hide Panels**: Customize visible panels

## Storage Methods

### Local Storage (Client)
```typescript
interface LocalSettings {
  theme: 'light' | 'dark' | 'system';
  editorFontSize: number;
  sidebarWidth: number;
  notifications: boolean;
}
```

### Server Storage (Sync)
```typescript
interface ServerSettings {
  userId: string;
  preferences: UserPreferences;
  syncedAt: Date;
}
```

### Sync Strategy
- Local-first: Changes save immediately to localStorage
- Background sync: Periodic server synchronization
- Conflict resolution: Last-write-wins or merge
- Offline support: Works without connection

## Technical Implementation

### Zustand Store
```typescript
interface SettingsStore {
  settings: Settings;
  updateSetting: (key: string, value: any) => void;
  resetSettings: () => void;
  syncToServer: () => Promise<void>;
}
```

### Persistence Middleware
```typescript
persist(
  (set, get) => ({
    // store implementation
  }),
  {
    name: 'assistant-settings',
    storage: createJSONStorage(() => localStorage),
  }
)
```

### Server Sync
```typescript
async function syncSettings() {
  const local = localStorage.getItem('settings');
  const server = await fetchServerSettings();
  const merged = mergeSettings(local, server);
  return merged;
}
```

## Settings UI

### Settings Panel
- Categorized sections
- Search settings
- Import/export settings
- Reset to defaults

### Quick Settings
- Theme toggle in header
- Font size controls in editor
- Layout presets
- Keyboard shortcuts

### Advanced Settings
- Developer options
- Feature flags
- Performance tuning
- Debug mode

## Cross-Device Sync

### Synchronization
- Automatic sync on login
- Manual sync trigger
- Conflict indicators
- Last synced timestamp

### Device Management
- List connected devices
- Per-device settings
- Sync preferences
- Revoke device access

## Default Settings

### Production Defaults
```typescript
{
  theme: 'system',
  editorFontSize: 14,
  tabSize: 2,
  lineWrap: true,
  autoSave: true,
  notifications: true,
  aiTemperature: 0.7,
  maxTokens: 2000
}
```

### Feature Flags
```typescript
{
  enableImageGeneration: true,
  enableBatchOperations: true,
  enableUrlScraping: true,
  enableAdvancedSearch: false
}
```

## Migration & Versioning

### Schema Versioning
- Version tracking in settings
- Automatic migrations
- Backward compatibility
- Migration rollback

### Breaking Changes
- Clear migration paths
- User notifications
- Data backup before migration
- Graceful degradation
