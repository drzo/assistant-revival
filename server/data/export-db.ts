import { db } from '../db';
import { assistantPrompts, orgPersona } from '../../shared/schema';
import { writeFileSync } from 'fs';

async function exportData() {
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  try {
    const prompts = await db.select().from(assistantPrompts);
    const persona = await db.select().from(orgPersona);
    
    writeFileSync('server/data/prompts-seed.json', JSON.stringify(prompts, null, 2));
    writeFileSync('server/data/org-persona-seed.json', JSON.stringify(persona, null, 2));
    
    console.log('Exported ' + prompts.length + ' prompts');
    console.log('Exported ' + persona.length + ' org persona records');
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportData();
