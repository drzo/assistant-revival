import { z } from "zod";

// File schema for uploaded files
export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  language: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
});

export type File = z.infer<typeof fileSchema>;
export type InsertFile = Omit<File, "id" | "uploadedAt">;

// Message schema for chat
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  mentionedFiles: z.array(z.string()).optional(),
  codeChanges: z.array(z.object({
    fileId: z.string(),
    fileName: z.string(),
    oldContent: z.string(),
    newContent: z.string(),
  })).optional(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = Omit<Message, "id" | "createdAt">;

// Session schema for chat sessions
export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;
export type InsertSession = Omit<Session, "id" | "createdAt" | "updatedAt">;

// Checkpoint schema for rollback functionality
export const checkpointSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  messageId: z.string(),
  description: z.string(),
  files: z.array(fileSchema),
  createdAt: z.string(),
});

export type Checkpoint = z.infer<typeof checkpointSchema>;
export type InsertCheckpoint = Omit<Checkpoint, "id" | "createdAt">;

// Code change for diffs
export const codeChangeSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  oldContent: z.string(),
  newContent: z.string(),
});

export type CodeChange = z.infer<typeof codeChangeSchema>;

// User schema (keeping for compatibility)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = Omit<User, "id">;

// Assistant prompt schema
export const assistantPromptSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  isDefault: z.boolean().optional().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AssistantPrompt = z.infer<typeof assistantPromptSchema>;
export type InsertAssistantPrompt = Omit<AssistantPrompt, "id" | "createdAt" | "updatedAt">;

export * from "./models/chat";
export * from "./models/assistant-prompt";