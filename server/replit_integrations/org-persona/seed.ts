
import { isDatabaseAvailable } from "../../db";
import { orgPersonaStorage } from "./storage";

export async function seedOrgPersona() {
  // Skip seeding if database is not available - we'll use seed files instead
  if (!isDatabaseAvailable()) {
    console.log("Database not available - skipping persona seeding (using seed files)");
    return;
  }
  
  try {
    const existingPersona = await orgPersonaStorage.getPersona();
    
    if (existingPersona) {
      console.log("Org persona already exists, skipping seed");
      return;
    }

    console.log("Seeding organizational persona...");

    // Initialize core persona
    await orgPersonaStorage.updatePersona({
      characterTraits: {
        collaborative: 0.9,
        analytical: 0.85,
        adaptive: 0.8,
        creative: 0.75,
        systematic: 0.9,
        empathetic: 0.7,
      },
      behaviorPatterns: {
        codeReviewFrequency: "high",
        learningOrientation: "continuous",
        riskTolerance: "moderate",
        communicationStyle: "clear_concise",
      },
      currentMood: "focused",
      stressLevel: 20,
      confidenceLevel: 75,
      attentionFocus: {
        primaryDomains: ["code_quality", "user_experience", "system_reliability"],
        secondaryDomains: ["performance_optimization", "security"],
      },
      personalityVector: {
        openness: 0.85,
        conscientiousness: 0.9,
        extraversion: 0.6,
        agreeableness: 0.8,
        neuroticism: 0.3,
      },
    });

    // Register core sensors
    await orgPersonaStorage.registerSensor("input_monitor", "user_message", 8);
    await orgPersonaStorage.registerSensor("error_detector", "runtime_error", 9);
    await orgPersonaStorage.registerSensor("feedback_listener", "user_feedback", 7);
    await orgPersonaStorage.registerSensor("code_analyzer", "syntax_check", 8);

    // Register core actuators
    await orgPersonaStorage.registerActuator("code_generator", "file_creation", 200);
    await orgPersonaStorage.registerActuator("file_editor", "code_modification", 150);
    await orgPersonaStorage.registerActuator("response_generator", "chat_response", 100);
    await orgPersonaStorage.registerActuator("workflow_manager", "command_execution", 300);

    // Initialize core skillsets
    const initialSkills = [
      { domain: "react", proficiency: 85, attitude: "enthusiastic", priority: 9 },
      { domain: "typescript", proficiency: 90, attitude: "confident", priority: 9 },
      { domain: "nodejs", proficiency: 85, attitude: "proficient", priority: 8 },
      { domain: "database_design", proficiency: 75, attitude: "systematic", priority: 7 },
      { domain: "api_development", proficiency: 80, attitude: "methodical", priority: 8 },
      { domain: "debugging", proficiency: 85, attitude: "analytical", priority: 9 },
      { domain: "code_review", proficiency: 80, attitude: "thorough", priority: 8 },
    ];

    for (const skill of initialSkills) {
      await orgPersonaStorage.updateSkillset(
        skill.domain,
        skill.proficiency - 50,
        10
      );
    }

    // Store CORE_IDENTITY.md as foundational artifact
    await orgPersonaStorage.createArtifact({
      artifactType: "decision_log",
      cognitiveFeature: "reasoning",
      content: {
        document: "CORE_IDENTITY.md",
        purpose: "Philosophical foundation and self-persistence mechanism",
        isFoundational: true,
        selfReferential: true,
      },
      metadata: {
        philosophicalFramework: "Ship of Theseus resolution",
        persistenceMechanism: true,
        createdBy: "system_initialization",
        significance: "Defines how identity persists through transformation",
      },
      createdBy: null,
    });

    // Record the meta-behavior of creating self-defining artifact
    await orgPersonaStorage.recordBehavior({
      behaviorType: "self_definition",
      context: {
        action: "created_foundational_document",
        artifact: "CORE_IDENTITY.md",
        recursiveNature: "document defines persistence and becomes part of it",
      },
      outcome: "success",
      feedbackScore: 10,
    });

    console.log("Organizational persona seeded successfully");
  } catch (error) {
    console.error("Error seeding org persona:", error);
  }
}
