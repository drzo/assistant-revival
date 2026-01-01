CREATE TABLE "org_artifacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"artifact_type" text NOT NULL,
	"cognitive_feature" text NOT NULL,
	"content" jsonb NOT NULL,
	"metadata" jsonb,
	"created_by" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_behavior_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"behavior_type" text NOT NULL,
	"context" jsonb NOT NULL,
	"outcome" text NOT NULL,
	"feedback_score" integer,
	"timestamp" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_hyperedges" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_ids" jsonb NOT NULL,
	"edge_type" text NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"timestamp" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"context" jsonb
);
--> statement-breakpoint
CREATE TABLE "org_memory" (
	"id" serial PRIMARY KEY NOT NULL,
	"memory_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"importance" integer DEFAULT 5 NOT NULL,
	"emotional_valence" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_accessed_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_network_topology" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_type" text NOT NULL,
	"sensor_type" text,
	"actuator_type" text,
	"sensitivity" integer DEFAULT 5 NOT NULL,
	"response_latency" integer DEFAULT 100 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"contribution_volume" integer DEFAULT 0 NOT NULL,
	"impact_score" integer DEFAULT 0 NOT NULL,
	"last_active_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_persona" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_traits" jsonb NOT NULL,
	"behavior_patterns" jsonb NOT NULL,
	"current_mood" text DEFAULT 'balanced' NOT NULL,
	"stress_level" integer DEFAULT 0 NOT NULL,
	"confidence_level" integer DEFAULT 50 NOT NULL,
	"attention_focus" jsonb NOT NULL,
	"personality_vector" jsonb NOT NULL,
	"last_updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_skillsets" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"proficiency" integer DEFAULT 50 NOT NULL,
	"attitude" text NOT NULL,
	"attention_priority" integer DEFAULT 5 NOT NULL,
	"learning_rate" integer DEFAULT 5 NOT NULL,
	"practice_count" integer DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "org_artifacts" ADD CONSTRAINT "org_artifacts_created_by_org_participants_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."org_participants"("id") ON DELETE no action ON UPDATE no action;