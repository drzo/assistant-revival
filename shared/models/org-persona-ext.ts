import { pgTable, serial, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Organizational Participant - represents contributors/users
export const orgParticipants = pgTable("org_participants", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // developer, architect, reviewer, etc.
  contributionVolume: integer("contribution_volume").default(0).notNull(),
  impactScore: integer("impact_score").default(0).notNull(),
  lastActiveAt: timestamp("last_active_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Hypergraph edges - weighted relationships between participants
export const orgHyperedges = pgTable("org_hyperedges", {
  id: serial("id").primaryKey(),
  participantIds: jsonb("participant_ids").notNull(), // array of participant IDs
  edgeType: text("edge_type").notNull(), // collaboration, review, conflict_resolution
  weight: integer("weight").default(1).notNull(),
  timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`).notNull(),
  context: jsonb("context"), // metadata about the interaction
});

// Organizational Memory Systems - analogous to cognitive memory
export const orgMemory = pgTable("org_memory", {
  id: serial("id").primaryKey(),
  memoryType: text("memory_type").notNull(), // episodic, semantic, procedural, working
  content: jsonb("content").notNull(),
  importance: integer("importance").default(5).notNull(), // 1-10 scale
  emotionalValence: integer("emotional_valence").default(0).notNull(), // -10 to +10
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastAccessedAt: timestamp("last_accessed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  accessCount: integer("access_count").default(0).notNull(),
});

// Artifacts and Records - cognitive features and knowledge
export const orgArtifacts = pgTable("org_artifacts", {
  id: serial("id").primaryKey(),
  artifactType: text("artifact_type").notNull(), // code, documentation, decision_log, pattern
  cognitiveFeature: text("cognitive_feature").notNull(), // perception, reasoning, learning, planning
  content: jsonb("content").notNull(),
  metadata: jsonb("metadata"),
  createdBy: integer("created_by").references(() => orgParticipants.id),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Skillsets and Knowledge Domains - products/services/equipment as skills
export const orgSkillsets = pgTable("org_skillsets", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull(), // react, nodejs, deployment, etc.
  proficiency: integer("proficiency").default(50).notNull(), // 0-100
  attitude: text("attitude").notNull(), // enthusiastic, cautious, experimental
  attentionPriority: integer("attention_priority").default(5).notNull(), // 1-10
  learningRate: integer("learning_rate").default(5).notNull(), // how quickly org improves
  practiceCount: integer("practice_count").default(0).notNull(),
  lastPracticedAt: timestamp("last_practiced_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Network Topology - embodied cognition sensors/actuators
export const orgNetworkTopology = pgTable("org_network_topology", {
  id: serial("id").primaryKey(),
  nodeType: text("node_type").notNull(), // sensor, actuator, processor
  sensorType: text("sensor_type"), // input_monitor, error_detector, user_feedback
  actuatorType: text("actuator_type"), // code_generator, file_editor, deployment
  sensitivity: integer("sensitivity").default(5).notNull(), // 1-10
  responseLatency: integer("response_latency").default(100).notNull(), // ms
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Organizational Persona State - the core self
export const orgPersona = pgTable("org_persona", {
  id: serial("id").primaryKey(),
  characterTraits: jsonb("character_traits").notNull(), // collaborative, analytical, adaptive
  behaviorPatterns: jsonb("behavior_patterns").notNull(), // historical patterns
  currentMood: text("current_mood").default("balanced").notNull(),
  stressLevel: integer("stress_level").default(0).notNull(), // 0-100
  confidenceLevel: integer("confidence_level").default(50).notNull(), // 0-100
  attentionFocus: jsonb("attention_focus").notNull(), // current priorities
  personalityVector: jsonb("personality_vector").notNull(), // multidimensional traits
  lastUpdatedAt: timestamp("last_updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Behavior History - organizational behavior pattern tracking
export const orgBehaviorHistory = pgTable("org_behavior_history", {
  id: serial("id").primaryKey(),
  behaviorType: text("behavior_type").notNull(),
  context: jsonb("context").notNull(),
  outcome: text("outcome").notNull(), // success, failure, partial
  feedbackScore: integer("feedback_score"), // -10 to +10
  timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Schemas
export const insertOrgParticipantSchema = createInsertSchema(orgParticipants).omit({
  id: true,
  createdAt: true,
});

export const insertOrgHyperedgeSchema = createInsertSchema(orgHyperedges).omit({
  id: true,
  timestamp: true,
});

export const insertOrgMemorySchema = createInsertSchema(orgMemory).omit({
  id: true,
  createdAt: true,
});

export const insertOrgArtifactSchema = createInsertSchema(orgArtifacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrgPersonaSchema = createInsertSchema(orgPersona).omit({
  id: true,
  lastUpdatedAt: true,
});

export const insertOrgBehaviorHistorySchema = createInsertSchema(orgBehaviorHistory).omit({
  id: true,
  timestamp: true,
});

export const insertOrgSkillsetSchema = createInsertSchema(orgSkillsets).omit({
  id: true,
  createdAt: true,
});

export const insertOrgNetworkTopologySchema = createInsertSchema(orgNetworkTopology).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type OrgParticipant = typeof orgParticipants.$inferSelect;
export type InsertOrgParticipant = z.infer<typeof insertOrgParticipantSchema>;
export type OrgHyperedge = typeof orgHyperedges.$inferSelect;
export type InsertOrgHyperedge = z.infer<typeof insertOrgHyperedgeSchema>;
export type OrgMemory = typeof orgMemory.$inferSelect;
export type InsertOrgMemory = z.infer<typeof insertOrgMemorySchema>;
export type OrgArtifact = typeof orgArtifacts.$inferSelect;
export type InsertOrgArtifact = z.infer<typeof insertOrgArtifactSchema>;
export type OrgPersona = typeof orgPersona.$inferSelect;
export type InsertOrgPersona = z.infer<typeof insertOrgPersonaSchema>;
export type OrgBehaviorHistory = typeof orgBehaviorHistory.$inferSelect;
export type InsertOrgBehaviorHistory = z.infer<typeof insertOrgBehaviorHistorySchema>;
export type OrgSkillset = typeof orgSkillsets.$inferSelect;
export type InsertOrgSkillset = z.infer<typeof insertOrgSkillsetSchema>;
export type OrgNetworkTopology = typeof orgNetworkTopology.$inferSelect;
export type InsertOrgNetworkTopology = z.infer<typeof insertOrgNetworkTopologySchema>;