import { readFileSync } from 'fs';
import { assistantPromptStorage } from './storage';

interface ImportPrompt {
  id: number;
  name: string;
  instructions: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export async function importPromptsFromJson(jsonFilePath: string) {
  try {
    console.log(`📥 Starting import from ${jsonFilePath}...`);
    
    const fileContent = readFileSync(jsonFilePath, 'utf-8');
    const prompts: ImportPrompt[] = JSON.parse(fileContent);
    
    console.log(`📊 Found ${prompts.length} prompts to import`);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const prompt of prompts) {
      try {
        // Check if prompt with same name already exists
        const existing = await assistantPromptStorage.getAllPrompts();
        const duplicate = existing.find(p => p.name === prompt.name);
        
        if (duplicate) {
          console.log(`⏭️  Skipping duplicate: ${prompt.name}`);
          skipped++;
          continue;
        }
        
        // Import the prompt
        await assistantPromptStorage.createPrompt(
          prompt.name,
          prompt.instructions,
          prompt.is_default
        );
        
        imported++;
        
        if (imported % 10 === 0) {
          console.log(`✓ Imported ${imported} prompts...`);
        }
      } catch (error) {
        console.error(`❌ Error importing prompt "${prompt.name}":`, error);
        errors++;
      }
    }
    
    console.log('\n📈 Import Summary:');
    console.log(`   ✅ Successfully imported: ${imported}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total processed: ${prompts.length}`);
    
    return { imported, skipped, errors, total: prompts.length };
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const jsonPath = process.argv[2] || './assistant_prompts.json';
  
  importPromptsFromJson(jsonPath)
    .then(result => {
      console.log('\n✨ Import completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Import failed:', error);
      process.exit(1);
    });
}
