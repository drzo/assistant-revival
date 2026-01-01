
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CommandExecution {
  command: string;
  timestamp: Date;
  output?: string;
  success: boolean;
  workingDirectory?: string;
}

interface CommandHistoryState {
  history: CommandExecution[];
  addExecution: (execution: Omit<CommandExecution, 'timestamp'>) => void;
  clearHistory: () => void;
  getRecentCommands: (limit?: number) => CommandExecution[];
}

export const useCommandHistory = create<CommandHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      
      addExecution: (execution) => set((state) => ({
        history: [
          { ...execution, timestamp: new Date() },
          ...state.history,
        ].slice(0, 100), // Keep last 100 executions
      })),
      
      clearHistory: () => set({ history: [] }),
      
      getRecentCommands: (limit = 10) => {
        return get().history.slice(0, limit);
      },
    }),
    {
      name: 'command-history-storage',
    }
  )
);
