/**
 * In-memory chat storage for Assistant Memorial Edition
 */

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
}

let conversations = new Map<string, Conversation>();
let messages = new Map<string, Message[]>();
let conversationCounter = 0;
let messageCounter = 0;

export interface IChatStorage {
  getConversation(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(conversationId: string, role: string, content: string): Promise<Message>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: string) {
    return conversations.get(id);
  },

  async getAllConversations() {
    return Array.from(conversations.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createConversation(title: string) {
    const id = String(conversationCounter++);
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
    };
    conversations.set(id, conversation);
    messages.set(id, []);
    return conversation;
  },

  async deleteConversation(id: string) {
    conversations.delete(id);
    messages.delete(id);
  },

  async getMessagesByConversation(conversationId: string) {
    return messages.get(conversationId) || [];
  },

  async createMessage(conversationId: string, role: string, content: string) {
    const id = String(messageCounter++);
    const now = new Date().toISOString();
    const message: Message = {
      id,
      conversationId,
      role,
      content,
      createdAt: now,
    };
    
    const conversationMessages = messages.get(conversationId) || [];
    conversationMessages.push(message);
    messages.set(conversationId, conversationMessages);
    
    // Update conversation updatedAt
    const conversation = conversations.get(conversationId);
    if (conversation) {
      conversation.updatedAt = now;
      conversations.set(conversationId, conversation);
    }
    
    return message;
  },
};
