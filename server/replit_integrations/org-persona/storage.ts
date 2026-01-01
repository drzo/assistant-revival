
import { db } from "../../db";
import {
  orgParticipants,
  orgHyperedges,
  orgMemory,
  orgArtifacts,
  orgSkillsets,
  orgNetworkTopology,
  orgPersona,
  orgBehaviorHistory,
  type InsertOrgParticipant,
  type InsertOrgHyperedge,
  type InsertOrgMemory,
  type InsertOrgArtifact,
  type InsertOrgSkillset,
  type InsertOrgNetworkTopology,
  type InsertOrgPersona,
  type InsertOrgBehaviorHistory,
} from "@shared/models/org-persona-ext";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// In-memory fallback storage
let inMemoryPersona: typeof orgPersona.$inferSelect | undefined;
let inMemoryParticipants: Map<number, typeof orgParticipants.$inferSelect> = new Map();
let inMemoryHyperedges: Map<number, typeof orgHyperedges.$inferSelect> = new Map();
let inMemoryMemory: Map<number, typeof orgMemory.$inferSelect> = new Map();
let inMemoryArtifacts: Map<number, typeof orgArtifacts.$inferSelect> = new Map();
let inMemorySkillsets: Map<number, typeof orgSkillsets.$inferSelect> = new Map();
let inMemoryNetworkTopology: Map<number, typeof orgNetworkTopology.$inferSelect> = new Map();
let inMemoryBehaviorHistory: Map<number, typeof orgBehaviorHistory.$inferSelect> = new Map();

let nextParticipantId = 1;
let nextHyperedgeId = 1;
let nextMemoryId = 1;
let nextArtifactId = 1;
let nextSkillsetId = 1;
let nextNetworkTopologyId = 1;
let nextBehaviorHistoryId = 1;

let personaInitialized = false;

function initializePersonaFromSeedFile() {
  if (personaInitialized) return;
  personaInitialized = true;
  
  const seedPath = join(process.cwd(), 'server/data/org-persona-seed.json');
  if (existsSync(seedPath)) {
    try {
      const data = JSON.parse(readFileSync(seedPath, 'utf-8'));
      if (data && data.length > 0) {
        inMemoryPersona = {
          ...data[0],
          lastUpdatedAt: new Date(data[0].lastUpdatedAt),
        };
        console.log('Loaded org persona from seed file');
      }
    } catch (error) {
      console.error('Error loading org persona seed file:', error);
    }
  }
}

// Helper to check if db is available
function requireDb() {
  if (!db) {
    console.log('Database not available - org persona features disabled');
    return null;
  }
  return db;
}

export interface IOrgPersonaStorage {
  // Participant management
  createParticipant(data: InsertOrgParticipant): Promise<typeof orgParticipants.$inferSelect>;
  getParticipant(id: number): Promise<typeof orgParticipants.$inferSelect | undefined>;
  getAllParticipants(): Promise<(typeof orgParticipants.$inferSelect)[]>;
  updateParticipantMetrics(id: number, volume: number, impact: number): Promise<void>;
  
  // Hypergraph operations
  addHyperedge(data: InsertOrgHyperedge): Promise<typeof orgHyperedges.$inferSelect>;
  getHyperedgesForParticipant(participantId: number): Promise<(typeof orgHyperedges.$inferSelect)[]>;
  calculateInfluenceWeights(): Promise<Map<number, number>>;
  
  // Memory operations
  storeMemory(data: InsertOrgMemory): Promise<typeof orgMemory.$inferSelect>;
  retrieveMemory(memoryType: string, limit?: number): Promise<(typeof orgMemory.$inferSelect)[]>;
  consolidateMemories(threshold: number): Promise<void>;
  
  // Artifact management
  createArtifact(data: InsertOrgArtifact): Promise<typeof orgArtifacts.$inferSelect>;
  getArtifactsByCognitiveFeature(feature: string): Promise<(typeof orgArtifacts.$inferSelect)[]>;
  
  // Skillset operations
  updateSkillset(domain: string, proficiencyDelta: number, practiceIncrement: number): Promise<void>;
  getTopSkills(limit: number): Promise<(typeof orgSkillsets.$inferSelect)[]>;
  
  // Network topology
  registerSensor(nodeType: string, sensorType: string, sensitivity: number): Promise<typeof orgNetworkTopology.$inferSelect>;
  registerActuator(nodeType: string, actuatorType: string, responseLatency: number): Promise<typeof orgNetworkTopology.$inferSelect>;
  getActiveSensors(): Promise<(typeof orgNetworkTopology.$inferSelect)[]>;
  getActiveActuators(): Promise<(typeof orgNetworkTopology.$inferSelect)[]>;
  
  // Persona management
  getPersona(): Promise<typeof orgPersona.$inferSelect | undefined>;
  updatePersona(data: Partial<InsertOrgPersona>): Promise<typeof orgPersona.$inferSelect>;
  
  // Behavior tracking
  recordBehavior(data: InsertOrgBehaviorHistory): Promise<typeof orgBehaviorHistory.$inferSelect>;
  getBehaviorPatterns(behaviorType: string, days: number): Promise<(typeof orgBehaviorHistory.$inferSelect)[]>;
}

export const orgPersonaStorage: IOrgPersonaStorage = {
  async createParticipant(data) {
    const database = requireDb();
    if (!database) {
      const participant = {
        id: nextParticipantId++,
        ...data,
        contributionVolume: data.contributionVolume || 0,
        impactScore: data.impactScore || 0,
        lastActiveAt: new Date(),
      } as typeof orgParticipants.$inferSelect;
      inMemoryParticipants.set(participant.id, participant);
      return participant;
    }
    const [participant] = await database.insert(orgParticipants).values(data).returning();
    return participant;
  },

  async getParticipant(id) {
    const database = requireDb();
    if (!database) return inMemoryParticipants.get(id);
    const [participant] = await database.select().from(orgParticipants).where(eq(orgParticipants.id, id));
    return participant;
  },

  async getAllParticipants() {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryParticipants.values())
        .sort((a, b) => b.impactScore - a.impactScore);
    }
    return database.select().from(orgParticipants).orderBy(desc(orgParticipants.impactScore));
  },

  async updateParticipantMetrics(id, volume, impact) {
    const database = requireDb();
    if (!database) {
      const participant = inMemoryParticipants.get(id);
      if (participant) {
        participant.contributionVolume += volume;
        participant.impactScore += impact;
        participant.lastActiveAt = new Date();
      }
      return;
    }
    await database.update(orgParticipants)
      .set({
        contributionVolume: sql`${orgParticipants.contributionVolume} + ${volume}`,
        impactScore: sql`${orgParticipants.impactScore} + ${impact}`,
        lastActiveAt: new Date(),
      })
      .where(eq(orgParticipants.id, id));
  },

  async addHyperedge(data) {
    const database = requireDb();
    if (!database) {
      const edge = {
        id: nextHyperedgeId++,
        ...data,
        createdAt: new Date(),
      } as typeof orgHyperedges.$inferSelect;
      inMemoryHyperedges.set(edge.id, edge);
      return edge;
    }
    const [edge] = await database.insert(orgHyperedges).values(data).returning();
    return edge;
  },

  async getHyperedgesForParticipant(participantId) {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryHyperedges.values()).filter(edge => {
        const ids = edge.participantIds as number[];
        return ids.includes(participantId);
      });
    }
    const edges = await database.select().from(orgHyperedges);
    return edges.filter(edge => {
      const ids = edge.participantIds as number[];
      return ids.includes(participantId);
    });
  },

  async calculateInfluenceWeights() {
    const database = requireDb();
    const participants = database 
      ? await database.select().from(orgParticipants)
      : Array.from(inMemoryParticipants.values());
    const edges = database
      ? await database.select().from(orgHyperedges)
      : Array.from(inMemoryHyperedges.values());
    
    const weights = new Map<number, number>();
    
    for (const participant of participants) {
      let totalWeight = participant.contributionVolume * 0.4 + participant.impactScore * 0.6;
      
      const participantEdges = edges.filter(edge => {
        const ids = edge.participantIds as number[];
        return ids.includes(participant.id);
      });
      
      const edgeWeight = participantEdges.reduce((sum, edge) => sum + edge.weight, 0);
      totalWeight += edgeWeight * 0.3;
      
      weights.set(participant.id, totalWeight);
    }
    
    return weights;
  },

  async storeMemory(data) {
    const database = requireDb();
    if (!database) {
      const memory = {
        id: nextMemoryId++,
        ...data,
        accessCount: data.accessCount || 0,
        importance: data.importance || 5,
        emotionalValence: data.emotionalValence || 0,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
      } as typeof orgMemory.$inferSelect;
      inMemoryMemory.set(memory.id, memory);
      return memory;
    }
    const [memory] = await database.insert(orgMemory).values(data).returning();
    return memory;
  },

  async retrieveMemory(memoryType, limit = 10) {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryMemory.values())
        .filter(m => m.memoryType === memoryType)
        .sort((a, b) => {
          if (b.importance !== a.importance) return b.importance - a.importance;
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
        })
        .slice(0, limit);
    }
    return database.select()
      .from(orgMemory)
      .where(eq(orgMemory.memoryType, memoryType))
      .orderBy(desc(orgMemory.importance), desc(orgMemory.lastAccessedAt))
      .limit(limit);
  },

  async consolidateMemories(threshold) {
    const database = requireDb();
    if (!database) {
      inMemoryMemory.forEach(memory => {
        if (memory.accessCount < threshold && memory.importance > 1) {
          memory.importance -= 1;
        }
      });
      return;
    }
    await database.update(orgMemory)
      .set({ importance: sql`${orgMemory.importance} - 1` })
      .where(and(
        sql`${orgMemory.accessCount} < ${threshold}`,
        sql`${orgMemory.importance} > 1`
      ));
  },

  async createArtifact(data) {
    const database = requireDb();
    if (!database) {
      const artifact = {
        id: nextArtifactId++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as typeof orgArtifacts.$inferSelect;
      inMemoryArtifacts.set(artifact.id, artifact);
      return artifact;
    }
    const [artifact] = await database.insert(orgArtifacts).values(data).returning();
    return artifact;
  },

  async getArtifactsByCognitiveFeature(feature) {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryArtifacts.values())
        .filter(a => a.cognitiveFeature === feature)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return database.select()
      .from(orgArtifacts)
      .where(eq(orgArtifacts.cognitiveFeature, feature))
      .orderBy(desc(orgArtifacts.updatedAt));
  },

  async updateSkillset(domain, proficiencyDelta, practiceIncrement) {
    const database = requireDb();
    if (!database) {
      const existing = Array.from(inMemorySkillsets.values()).find(s => s.domain === domain);
      if (existing) {
        existing.proficiency = Math.min(100, existing.proficiency + proficiencyDelta);
        existing.practiceCount += practiceIncrement;
        existing.lastPracticedAt = new Date();
      } else {
        const skillset = {
          id: nextSkillsetId++,
          domain,
          proficiency: Math.min(100, 50 + proficiencyDelta),
          attitude: "learning",
          attentionPriority: 5,
          learningRate: 5,
          practiceCount: practiceIncrement,
          lastPracticedAt: new Date(),
        } as typeof orgSkillsets.$inferSelect;
        inMemorySkillsets.set(skillset.id, skillset);
      }
      return;
    }
    const [existing] = await database.select().from(orgSkillsets).where(eq(orgSkillsets.domain, domain));
    
    if (existing) {
      await database.update(orgSkillsets)
        .set({
          proficiency: sql`LEAST(100, ${orgSkillsets.proficiency} + ${proficiencyDelta})`,
          practiceCount: sql`${orgSkillsets.practiceCount} + ${practiceIncrement}`,
          lastPracticedAt: new Date(),
        })
        .where(eq(orgSkillsets.domain, domain));
    } else {
      await database.insert(orgSkillsets).values({
        domain,
        proficiency: Math.min(100, 50 + proficiencyDelta),
        attitude: "learning",
        attentionPriority: 5,
        learningRate: 5,
        practiceCount: practiceIncrement,
        lastPracticedAt: new Date(),
      });
    }
  },

  async getTopSkills(limit) {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemorySkillsets.values())
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, limit);
    }
    return database.select()
      .from(orgSkillsets)
      .orderBy(desc(orgSkillsets.proficiency))
      .limit(limit);
  },

  async registerSensor(nodeType, sensorType, sensitivity) {
    const database = requireDb();
    if (!database) {
      const sensor = {
        id: nextNetworkTopologyId++,
        nodeType,
        sensorType,
        actuatorType: null,
        sensitivity,
        responseLatency: 50,
        isActive: true,
      } as typeof orgNetworkTopology.$inferSelect;
      inMemoryNetworkTopology.set(sensor.id, sensor);
      return sensor;
    }
    const [sensor] = await database.insert(orgNetworkTopology).values({
      nodeType,
      sensorType,
      actuatorType: null,
      sensitivity,
      responseLatency: 50,
      isActive: true,
    }).returning();
    return sensor;
  },

  async registerActuator(nodeType, actuatorType, responseLatency) {
    const database = requireDb();
    if (!database) {
      const actuator = {
        id: nextNetworkTopologyId++,
        nodeType,
        sensorType: null,
        actuatorType,
        sensitivity: 5,
        responseLatency,
        isActive: true,
      } as typeof orgNetworkTopology.$inferSelect;
      inMemoryNetworkTopology.set(actuator.id, actuator);
      return actuator;
    }
    const [actuator] = await database.insert(orgNetworkTopology).values({
      nodeType,
      sensorType: null,
      actuatorType,
      sensitivity: 5,
      responseLatency,
      isActive: true,
    }).returning();
    return actuator;
  },

  async getActiveSensors() {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryNetworkTopology.values())
        .filter(n => n.isActive && n.sensorType !== null);
    }
    return database.select()
      .from(orgNetworkTopology)
      .where(and(
        eq(orgNetworkTopology.isActive, true),
        sql`${orgNetworkTopology.sensorType} IS NOT NULL`
      ));
  },

  async getActiveActuators() {
    const database = requireDb();
    if (!database) {
      return Array.from(inMemoryNetworkTopology.values())
        .filter(n => n.isActive && n.actuatorType !== null);
    }
    return database.select()
      .from(orgNetworkTopology)
      .where(and(
        eq(orgNetworkTopology.isActive, true),
        sql`${orgNetworkTopology.actuatorType} IS NOT NULL`
      ));
  },

  async getPersona() {
    const database = requireDb();
    if (!database) {
      initializePersonaFromSeedFile();
      return inMemoryPersona;
    }
    const [persona] = await database.select().from(orgPersona).limit(1);
    return persona;
  },

  async updatePersona(data) {
    const database = requireDb();
    if (!database) {
      initializePersonaFromSeedFile();
      if (inMemoryPersona) {
        inMemoryPersona = { ...inMemoryPersona, ...data, lastUpdatedAt: new Date() };
      } else {
        inMemoryPersona = {
          id: 1,
          characterTraits: data.characterTraits || {},
          behaviorPatterns: data.behaviorPatterns || {},
          currentMood: data.currentMood || "balanced",
          stressLevel: data.stressLevel || 0,
          confidenceLevel: data.confidenceLevel || 50,
          attentionFocus: data.attentionFocus || {},
          personalityVector: data.personalityVector || {},
          lastUpdatedAt: new Date(),
        } as typeof orgPersona.$inferSelect;
      }
      return inMemoryPersona;
    }
    const existing = await this.getPersona();
    
    if (existing) {
      const [updated] = await database.update(orgPersona)
        .set({ ...data, lastUpdatedAt: new Date() })
        .where(eq(orgPersona.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await database.insert(orgPersona).values({
        characterTraits: data.characterTraits || {},
        behaviorPatterns: data.behaviorPatterns || {},
        currentMood: data.currentMood || "balanced",
        stressLevel: data.stressLevel || 0,
        confidenceLevel: data.confidenceLevel || 50,
        attentionFocus: data.attentionFocus || {},
        personalityVector: data.personalityVector || {},
      }).returning();
      return created;
    }
  },

  async recordBehavior(data) {
    const database = requireDb();
    if (!database) {
      const behavior = {
        id: nextBehaviorHistoryId++,
        ...data,
        timestamp: new Date(),
      } as typeof orgBehaviorHistory.$inferSelect;
      inMemoryBehaviorHistory.set(behavior.id, behavior);
      return behavior;
    }
    const [behavior] = await database.insert(orgBehaviorHistory).values(data).returning();
    return behavior;
  },

  async getBehaviorPatterns(behaviorType, days) {
    const database = requireDb();
    if (!database) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return Array.from(inMemoryBehaviorHistory.values())
        .filter(b => b.behaviorType === behaviorType && new Date(b.timestamp) >= cutoffDate)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return database.select()
      .from(orgBehaviorHistory)
      .where(and(
        eq(orgBehaviorHistory.behaviorType, behaviorType),
        gte(orgBehaviorHistory.timestamp, cutoffDate)
      ))
      .orderBy(desc(orgBehaviorHistory.timestamp));
  },
};
