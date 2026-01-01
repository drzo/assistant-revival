import { readFileSync } from 'fs';
import { isDatabaseAvailable } from '../../db';
import { assistantPromptStorage } from './storage';

interface ParsedPrompt {
  name: string;
  instructions: string;
}

function parsePromptsFile(content: string): ParsedPrompt[] {
  const prompts: ParsedPrompt[] = [];
  const lines = content.split('\n');
  
  let currentName = '';
  let currentPrompt = '';
  let pendingName = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === 'Title(max 70 characters)') {
      if (currentName && currentPrompt) {
        prompts.push({
          name: currentName.substring(0, 70),
          instructions: currentPrompt.trim()
        });
      }
      currentName = pendingName;
      currentPrompt = '';
      pendingName = '';
      continue;
    }
    
    if (trimmedLine.startsWith('Prompt')) {
      const promptContent = trimmedLine.substring(6).trim();
      if (promptContent.startsWith('\\')) {
        currentPrompt = promptContent.substring(1);
      } else {
        currentPrompt = promptContent;
      }
      continue;
    }
    
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      pendingName = trimmedLine;
    }
  }
  
  if (currentName && currentPrompt) {
    prompts.push({
      name: currentName.substring(0, 70),
      instructions: currentPrompt.trim()
    });
  }
  
  return prompts;
}

export async function importBulkPrompts(filePath: string): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;
  
  // Skip if database is not available
  if (!isDatabaseAvailable()) {
    console.log("Database not available - skipping bulk import (using seed files)");
    return { imported: 0, errors: [] };
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const prompts = parsePromptsFile(content);
    
    console.log(`Found ${prompts.length} prompts to import`);
    
    for (const prompt of prompts) {
      try {
        if (prompt.name && prompt.instructions) {
          const cleanName = prompt.name
            .replace(/\\/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .trim();
          
          const cleanInstructions = prompt.instructions
            .replace(/\\\*/g, '*')
            .replace(/\\#/g, '#')
            .replace(/\\\[/g, '[')
            .replace(/\\\]/g, ']')
            .replace(/\\\`/g, '`')
            .trim();
          
          await assistantPromptStorage.createPrompt(cleanName, cleanInstructions, false);
          imported++;
          console.log(`Imported: ${cleanName}`);
        }
      } catch (err: any) {
        errors.push(`Failed to import "${prompt.name}": ${err.message}`);
      }
    }
  } catch (err: any) {
    errors.push(`Failed to read file: ${err.message}`);
  }
  
  return { imported, errors };
}
