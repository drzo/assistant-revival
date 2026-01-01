
import * as fs from 'fs/promises';
import * as path from 'path';
import { assistantPromptStorage } from './storage';

export async function importPromptsFromFile() {
  try {
    const filePath = path.join(process.cwd(), 'server', 'data', 'prompts-seed.json');

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      console.log('No prompts-seed.json file found, skipping import');
      return;
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const prompts = JSON.parse(fileContent);

    if (!Array.isArray(prompts)) {
      console.error('prompts-seed.json should contain an array of prompts');
      return;
    }

    // Get existing prompts to avoid duplicates
    const existingPrompts = await assistantPromptStorage.getAllPrompts();
    const existingNames = new Set(existingPrompts.map(p => p.name.toLowerCase()));

    let importedCount = 0;

    for (const prompt of prompts) {
      if (prompt.name && prompt.instructions) {
        // Skip if prompt with same name already exists
        if (existingNames.has(prompt.name.toLowerCase())) {
          continue;
        }

        await assistantPromptStorage.createPrompt(
          prompt.name,
          prompt.instructions,
          prompt.isDefault || false
        );
        importedCount++;
      }
    }

    console.log(`Successfully imported ${importedCount} prompts from file`);
  } catch (error) {
    console.error('Error importing prompts from file:', error);
    throw error;
  }
}
