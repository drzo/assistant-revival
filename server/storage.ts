import { randomUUID } from "crypto";
import type { File, Message, Session, Checkpoint, InsertFile, InsertMessage, InsertSession, InsertCheckpoint } from "@shared/schema";

export interface IStorage {
  getSession(id: string): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  deleteSession(id: string): Promise<void>;
  
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  createMessage(sessionId: string, message: InsertMessage): Promise<Message>;
  
  getFile(id: string): Promise<File | undefined>;
  getAllFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, content: string): Promise<File | undefined>;
  deleteFile(id: string): Promise<void>;
  
  getCheckpointsBySession(sessionId: string): Promise<Checkpoint[]>;
  createCheckpoint(checkpoint: InsertCheckpoint): Promise<Checkpoint>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private files: Map<string, File> = new Map();
  private checkpoints: Map<string, Checkpoint[]> = new Map();

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const session: Session = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.sessions.set(id, session);
    this.messages.set(id, []);
    return session;
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions.delete(id);
    this.messages.delete(id);
    this.checkpoints.delete(id);
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return this.messages.get(sessionId) || [];
  }

  async createMessage(sessionId: string, insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date().toISOString(),
    };
    const sessionMessages = this.messages.get(sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(sessionId, sessionMessages);
    
    const session = this.sessions.get(sessionId);
    if (session) {
      session.updatedAt = new Date().toISOString();
      this.sessions.set(sessionId, session);
    }
    
    return message;
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getAllFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      uploadedAt: new Date().toISOString(),
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, content: string): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    file.content = content;
    file.size = content.length;
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    this.files.delete(id);
  }

  async getCheckpointsBySession(sessionId: string): Promise<Checkpoint[]> {
    return this.checkpoints.get(sessionId) || [];
  }

  async createCheckpoint(insertCheckpoint: InsertCheckpoint): Promise<Checkpoint> {
    const id = randomUUID();
    const checkpoint: Checkpoint = {
      ...insertCheckpoint,
      id,
      createdAt: new Date().toISOString(),
    };
    const sessionCheckpoints = this.checkpoints.get(insertCheckpoint.sessionId) || [];
    sessionCheckpoints.push(checkpoint);
    this.checkpoints.set(insertCheckpoint.sessionId, sessionCheckpoints);
    return checkpoint;
  }
}

export const storage = new MemStorage();
