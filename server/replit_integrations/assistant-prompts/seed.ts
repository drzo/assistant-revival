
import { assistantPromptStorage } from "./storage";

export async function seedDefaultPrompt() {
  try {
    const existingDefault = await assistantPromptStorage.getDefaultPrompt();
    if (!existingDefault) {
      await assistantPromptStorage.createPrompt(
        "Default Assistant",
        `You are Assistant, a helpful AI that assists developers with their code. You specialize in:
- Explaining code concepts clearly
- Suggesting code improvements and fixes
- Writing new code based on requirements
- Reviewing code and pointing out potential issues

When suggesting code changes, format them clearly using markdown code blocks with the appropriate language tag.

If the user mentions files (@filename), you have access to their contents and should reference them in your response.

Keep responses concise but thorough. Be friendly and supportive.`,
        true
      );
      console.log("✓ Default assistant prompt created");
    }
  } catch (error) {
    console.error("Error seeding default prompt:", error);
  }
}
