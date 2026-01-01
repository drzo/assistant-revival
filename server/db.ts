
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { schema } from '@shared/schema';

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let dbAvailable = false;

export let db: ReturnType<typeof drizzle> | null = null;

function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    // Skip dev-only hostnames that won't resolve in production
    if (hostname === 'helium' || hostname === 'localhost') {
      if (process.env.NODE_ENV === 'production') {
        console.log(`Skipping database - hostname '${hostname}' not available in production`);
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function initializeDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!isValidDatabaseUrl(connectionString)) {
    console.log('No valid DATABASE_URL configured - using in-memory storage');
    return;
  }
  
  try {
    console.log('Attempting database connection...');
    
    // Create connection with short timeout to fail fast
    client = postgres(connectionString!, {
      connect_timeout: 5,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
    
    // Test the connection with a simple query
    const testResult = await Promise.race([
      client`SELECT 1 as test`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);
    
    if (!testResult) {
      throw new Error('Database connection test failed');
    }
    
    console.log('Database connection successful');
    dbInstance = drizzle(client, { schema });
    db = dbInstance;
    dbAvailable = true;
    
    // Run migrations
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Database initialized successfully');
    
  } catch (error: any) {
    console.warn('Database initialization failed - using in-memory storage');
    console.warn('Error:', error?.message || error);
    
    // Clean up any partial connection
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignore cleanup errors
      }
      client = null;
    }
    
    dbInstance = null;
    db = null;
    dbAvailable = false;
  }
}

export function isDatabaseAvailable() {
  return dbAvailable;
}
