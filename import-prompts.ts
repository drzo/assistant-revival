
import { importPromptsFromCSV } from "./server/replit_integrations/assistant-prompts/import-csv";

async function main() {
  console.log("Starting CSV import...");
  const result = await importPromptsFromCSV("attached_assets/assistant_prompts_1767212095240.csv");
  
  console.log("\n=== Import Results ===");
  console.log(`Imported: ${result.imported}`);
  console.log(`Skipped: ${result.skipped}`);
  
  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach(err => console.log(`  - ${err}`));
  }
  
  console.log("\nImport complete!");
}

main().catch(console.error);
