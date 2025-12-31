#!/usr/bin/env python3
"""
Import assistant prompts from JSON file into the Assistant Revival application.
This script handles duplicates by appending a number suffix to duplicate names.
"""

import json
import sys
from pathlib import Path

def load_prompts(json_path: str):
    """Load prompts from JSON file."""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def deduplicate_names(prompts):
    """
    Deduplicate prompt names by appending numbers to duplicates.
    Returns a new list with unique names.
    """
    seen_names = {}
    deduped_prompts = []
    
    for prompt in prompts:
        original_name = prompt['name']
        name = original_name
        
        if name in seen_names:
            # Name already exists, append a number
            counter = seen_names[name]
            name = f"{original_name} ({counter})"
            seen_names[original_name] = counter + 1
        else:
            seen_names[original_name] = 2  # Next duplicate will be (2)
        
        deduped_prompt = prompt.copy()
        deduped_prompt['name'] = name
        deduped_prompts.append(deduped_prompt)
    
    return deduped_prompts

def generate_sql_inserts(prompts, output_file: str):
    """Generate SQL INSERT statements for the prompts."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Assistant Prompts Import\n")
        f.write("-- Generated SQL INSERT statements\n\n")
        f.write("-- First, unset any existing default prompts\n")
        f.write("UPDATE assistant_prompts SET is_default = false WHERE is_default = true;\n\n")
        
        for i, prompt in enumerate(prompts, 1):
            name = prompt['name'].replace("'", "''")  # Escape single quotes
            instructions = prompt['instructions'].replace("'", "''")  # Escape single quotes
            is_default = 'true' if prompt['is_default'] else 'false'
            
            f.write(f"-- Prompt {i}: {prompt['name'][:50]}...\n")
            f.write(f"INSERT INTO assistant_prompts (name, instructions, is_default, created_at, updated_at)\n")
            f.write(f"VALUES (\n")
            f.write(f"  '{name}',\n")
            f.write(f"  '{instructions}',\n")
            f.write(f"  {is_default},\n")
            f.write(f"  CURRENT_TIMESTAMP,\n")
            f.write(f"  CURRENT_TIMESTAMP\n")
            f.write(f");\n\n")
    
    print(f"✅ Generated SQL file: {output_file}")
    print(f"   Total statements: {len(prompts)}")

def generate_typescript_seed(prompts, output_file: str):
    """Generate TypeScript seed file for the prompts."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated assistant prompts seed data\n")
        f.write("// DO NOT EDIT MANUALLY - Generated from assistant_prompts.json\n\n")
        f.write("import { assistantPromptStorage } from './storage';\n\n")
        f.write("interface PromptData {\n")
        f.write("  name: string;\n")
        f.write("  instructions: string;\n")
        f.write("  isDefault: boolean;\n")
        f.write("}\n\n")
        f.write("const PROMPTS: PromptData[] = ")
        
        # Convert to TypeScript format
        ts_prompts = []
        for prompt in prompts:
            ts_prompts.append({
                'name': prompt['name'],
                'instructions': prompt['instructions'],
                'isDefault': prompt['is_default']
            })
        
        # Write as JSON with proper formatting
        json_str = json.dumps(ts_prompts, indent=2, ensure_ascii=False)
        f.write(json_str)
        f.write(";\n\n")
        
        f.write("export async function seedAllPrompts() {\n")
        f.write("  console.log('📥 Starting import of all assistant prompts...');\n")
        f.write("  \n")
        f.write("  let imported = 0;\n")
        f.write("  let skipped = 0;\n")
        f.write("  let errors = 0;\n")
        f.write("  \n")
        f.write("  for (const prompt of PROMPTS) {\n")
        f.write("    try {\n")
        f.write("      const existing = await assistantPromptStorage.getAllPrompts();\n")
        f.write("      const duplicate = existing.find(p => p.name === prompt.name);\n")
        f.write("      \n")
        f.write("      if (duplicate) {\n")
        f.write("        skipped++;\n")
        f.write("        continue;\n")
        f.write("      }\n")
        f.write("      \n")
        f.write("      await assistantPromptStorage.createPrompt(\n")
        f.write("        prompt.name,\n")
        f.write("        prompt.instructions,\n")
        f.write("        prompt.isDefault\n")
        f.write("      );\n")
        f.write("      \n")
        f.write("      imported++;\n")
        f.write("      \n")
        f.write("      if (imported % 10 === 0) {\n")
        f.write("        console.log(`✓ Imported ${imported} prompts...`);\n")
        f.write("      }\n")
        f.write("    } catch (error) {\n")
        f.write("      console.error(`❌ Error importing prompt \"${prompt.name}\":`, error);\n")
        f.write("      errors++;\n")
        f.write("    }\n")
        f.write("  }\n")
        f.write("  \n")
        f.write("  console.log('\\n📈 Import Summary:');\n")
        f.write("  console.log(`   ✅ Successfully imported: ${imported}`);\n")
        f.write("  console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);\n")
        f.write("  console.log(`   ❌ Errors: ${errors}`);\n")
        f.write("  console.log(`   📊 Total processed: ${PROMPTS.length}`);\n")
        f.write("  \n")
        f.write("  return { imported, skipped, errors, total: PROMPTS.length };\n")
        f.write("}\n")
    
    print(f"✅ Generated TypeScript seed file: {output_file}")
    print(f"   Total prompts: {len(prompts)}")

def main():
    json_path = 'assistant_prompts.json'
    
    if not Path(json_path).exists():
        print(f"❌ Error: {json_path} not found!")
        sys.exit(1)
    
    print(f"📥 Loading prompts from {json_path}...")
    prompts = load_prompts(json_path)
    print(f"📊 Found {len(prompts)} prompts")
    
    # Deduplicate names
    print("🔄 Deduplicating prompt names...")
    deduped_prompts = deduplicate_names(prompts)
    
    # Count duplicates
    original_names = [p['name'] for p in prompts]
    deduped_names = [p['name'] for p in deduped_prompts]
    duplicates = len(original_names) - len(set(original_names))
    
    if duplicates > 0:
        print(f"⚠️  Found {duplicates} duplicate name(s), renamed with suffixes")
    
    # Generate outputs
    print("\n🔨 Generating output files...")
    generate_sql_inserts(deduped_prompts, 'import_prompts.sql')
    generate_typescript_seed(deduped_prompts, 'server/replit_integrations/assistant-prompts/seed-all.ts')
    
    print("\n✨ Import preparation complete!")
    print("\n📝 Next steps:")
    print("   1. Review the generated files:")
    print("      - import_prompts.sql (for direct database import)")
    print("      - server/replit_integrations/assistant-prompts/seed-all.ts (for app-level import)")
    print("   2. To import via SQL: psql <database> < import_prompts.sql")
    print("   3. To import via app: Add seedAllPrompts() call to server startup")

if __name__ == '__main__':
    main()
