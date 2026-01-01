
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { assistantPromptStorage } from './storage';

interface CSVPrompt {
  id: string;
  name: string;
  instructions: string;
  is_default: string;
  created_at: string;
  updated_at: string;
}

export async function importPromptsFromCSV(filePath: string): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  try {
    const content = readFileSync(filePath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVPrompt[];

    console.log(`Found ${records.length} prompts in CSV to import`);

    // Get existing prompts to check for duplicates
    const existingPrompts = await assistantPromptStorage.getAllPrompts();
    const existingNames = new Set(existingPrompts.map(p => p.name.toLowerCase()));

    for (const record of records) {
      try {
        const name = record.name.trim();
        const instructions = record.instructions.trim();
        const isDefault = record.is_default === 'true';

        // Skip if empty
        if (!name || !instructions) {
          skipped++;
          continue;
        }

        // Skip if already exists
        if (existingNames.has(name.toLowerCase())) {
          console.log(`Skipping duplicate prompt: ${name}`);
          skipped++;
          continue;
        }

        // Create the prompt
        await assistantPromptStorage.createPrompt(name, instructions, isDefault);
        imported++;
        console.log(`Imported: ${name}`);
      } catch (err: any) {
        errors.push(`Failed to import "${record.name}": ${err.message}`);
      }
    }
  } catch (err: any) {
    errors.push(`Failed to read CSV file: ${err.message}`);
  }

  return { imported, skipped, errors };
}
