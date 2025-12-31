import { readFileSync } from 'fs';
import { join } from 'path';

interface ImportPrompt {
  id: number;
  name: string;
  instructions: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

async function main() {
  const jsonPath = join(process.cwd(), 'assistant_prompts.json');
  
  console.log(`📥 Reading prompts from ${jsonPath}...`);
  
  const fileContent = readFileSync(jsonPath, 'utf-8');
  const prompts: ImportPrompt[] = JSON.parse(fileContent);
  
  console.log(`📊 Found ${prompts.length} prompts`);
  console.log('\n📝 Sample prompts:');
  
  // Show first 5 prompts as examples
  prompts.slice(0, 5).forEach((prompt, index) => {
    console.log(`\n${index + 1}. ${prompt.name}`);
    console.log(`   Default: ${prompt.is_default}`);
    console.log(`   Instructions length: ${prompt.instructions.length} chars`);
    console.log(`   Preview: ${prompt.instructions.substring(0, 100)}...`);
  });
  
  console.log('\n\n🎯 Unique prompt names:');
  const uniqueNames = new Set(prompts.map(p => p.name));
  console.log(`   Total unique: ${uniqueNames.size} out of ${prompts.length}`);
  
  if (uniqueNames.size < prompts.length) {
    console.log('\n⚠️  Warning: There are duplicate prompt names!');
    const nameCount = new Map<string, number>();
    prompts.forEach(p => {
      nameCount.set(p.name, (nameCount.get(p.name) || 0) + 1);
    });
    
    console.log('\n   Duplicates:');
    Array.from(nameCount.entries())
      .filter(([_, count]) => count > 1)
      .forEach(([name, count]) => {
        console.log(`   - "${name}": ${count} occurrences`);
      });
  }
  
  console.log('\n✅ Validation complete!');
}

main().catch(console.error);
