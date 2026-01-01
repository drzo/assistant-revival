
import { db } from "../../db";
import { conversations } from "@shared/models/chat";

export interface Checkpoint {
  id: string;
  sessionId: string;
  messageId: string;
  description: string;
  files: any[];
  createdAt: string;
}

export interface ICheckpointStorage {
  createCheckpoint(data: Omit<Checkpoint, 'id' | 'createdAt'>): Promise<Checkpoint>;
  getCheckpoint(id: string): Promise<Checkpoint | null>;
  getCheckpointsBySession(sessionId: string): Promise<Checkpoint[]>;
  deleteCheckpoint(id: string): Promise<void>;
}

const checkpoints = new Map<string, Checkpoint>();

export const checkpointStorage: ICheckpointStorage = {
  async createCheckpoint(data) {
    const checkpoint: Checkpoint = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    checkpoints.set(checkpoint.id, checkpoint);
    return checkpoint;
  },

  async getCheckpoint(id) {
    return checkpoints.get(id) || null;
  },

  async getCheckpointsBySession(sessionId) {
    return Array.from(checkpoints.values())
      .filter(cp => cp.sessionId === sessionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async deleteCheckpoint(id) {
    checkpoints.delete(id);
  },
};
