import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { File, Message, Session, Checkpoint, CodeChange } from "@shared/schema";

interface AssistantState {
  sessions: Session[];
  currentSessionId: string | null;
  sessionMessages: Record<string, Message[]>;
  files: File[];
  checkpoints: Checkpoint[];
  pendingChanges: CodeChange[];
  isLoading: boolean;
  isStreaming: boolean;
  
  messages: Message[];
  
  setCurrentSession: (sessionId: string | null) => void;
  addSession: (session: Session) => void;
  deleteSession: (sessionId: string) => void;
  
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  
  addFile: (file: File) => void;
  removeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  clearFiles: () => void;
  
  addCheckpoint: (checkpoint: Checkpoint) => void;
  restoreCheckpoint: (checkpointId: string) => void;
  
  setPendingChanges: (changes: CodeChange[]) => void;
  applyPendingChanges: () => void;
  clearPendingChanges: () => void;
  
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      sessionMessages: {},
      files: [],
      checkpoints: [],
      pendingChanges: [],
      isLoading: false,
      isStreaming: false,

      get messages() {
        const state = get();
        if (!state.currentSessionId) return [];
        return state.sessionMessages[state.currentSessionId] || [];
      },

      setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),
      
      addSession: (session) => set((state) => ({ 
        sessions: [session, ...state.sessions],
        currentSessionId: session.id,
        sessionMessages: {
          ...state.sessionMessages,
          [session.id]: [],
        },
      })),
      
      deleteSession: (sessionId) => set((state) => {
        const { [sessionId]: _, ...remainingMessages } = state.sessionMessages;
        return {
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
          sessionMessages: remainingMessages,
          checkpoints: state.checkpoints.filter((c) => c.sessionId !== sessionId),
        };
      }),

      addMessage: (message) => set((state) => {
        if (!state.currentSessionId) return state;
        const currentMessages = state.sessionMessages[state.currentSessionId] || [];
        return {
          sessionMessages: {
            ...state.sessionMessages,
            [state.currentSessionId]: [...currentMessages, message],
          },
        };
      }),
      
      updateMessage: (id, updates) => set((state) => {
        if (!state.currentSessionId) return state;
        const currentMessages = state.sessionMessages[state.currentSessionId] || [];
        return {
          sessionMessages: {
            ...state.sessionMessages,
            [state.currentSessionId]: currentMessages.map((m) => 
              m.id === id ? { ...m, ...updates } : m
            ),
          },
        };
      }),
      
      clearMessages: () => set((state) => {
        if (!state.currentSessionId) return state;
        return {
          sessionMessages: {
            ...state.sessionMessages,
            [state.currentSessionId]: [],
          },
        };
      }),

      addFile: (file) => set((state) => ({
        files: [...state.files, file],
      })),
      
      removeFile: (fileId) => set((state) => ({
        files: state.files.filter((f) => f.id !== fileId),
      })),
      
      updateFileContent: (fileId, content) => set((state) => ({
        files: state.files.map((f) => 
          f.id === fileId ? { ...f, content, size: content.length } : f
        ),
      })),
      
      clearFiles: () => set({ files: [] }),

      addCheckpoint: (checkpoint) => set((state) => ({
        checkpoints: [...state.checkpoints, checkpoint],
      })),
      
      restoreCheckpoint: (checkpointId) => {
        const state = get();
        const checkpoint = state.checkpoints.find((c) => c.id === checkpointId);
        if (checkpoint) {
          set({ files: checkpoint.files });
        }
      },

      setPendingChanges: (changes) => set({ pendingChanges: changes }),
      
      applyPendingChanges: () => {
        const state = get();
        const updatedFiles = state.files.map((file) => {
          const change = state.pendingChanges.find((c) => c.fileId === file.id);
          if (change) {
            return { ...file, content: change.newContent, size: change.newContent.length };
          }
          return file;
        });
        set({ files: updatedFiles, pendingChanges: [] });
      },
      
      clearPendingChanges: () => set({ pendingChanges: [] }),

      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
    }),
    {
      name: "assistant-memorial-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        sessionMessages: state.sessionMessages,
        files: state.files,
        checkpoints: state.checkpoints,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
