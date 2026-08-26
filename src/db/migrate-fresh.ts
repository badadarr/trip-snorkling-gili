import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { neon } from '@neondatabase/serverless';
import { execSync } from 'child_process';
import { seedDatabase } from './seed';

async function migrateFresh() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }

  console.log('🔄 [1/3] Connecting to Neon Database...');
  const sql = neon(url);

  console.log('🗑️  [2/3] Dropping all existing tables in public schema (CASCADE)...');
  try {
    // Get all tables in public schema
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;

    if (tables.length > 0) {
      for (const t of tables) {
        const tableName = (t as any).table_name;
        console.log(`   - Dropping table: ${tableName}`);
        await sql.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
      }
      console.log('✅ All tables dropped cleanly.');
    } else {
      console.log('ℹ️  No existing tables found.');
    }
  } catch (err: any) {
    console.error('❌ Error dropping tables:', err.message);
  }

  console.log('📦 [3/3] Running Drizzle Kit Push to re-create fresh tables...');
  try {
    execSync('npx drizzle-kit push', { stdio: 'inherit' });
    console.log('✅ Fresh schema created successfully!');
  } catch (err: any) {
    console.error('❌ Failed running drizzle-kit push:', err.message);
    process.exit(1);
  }

  // Check if --seed argument is passed
  const shouldSeed = process.argv.includes('--seed');
  if (shouldSeed) {
    console.log('🌱 Seeding initial data into fresh database...');
    const seedResult = await seedDatabase(url);
    if (seedResult.success) {
      console.log('✨ Migrate Fresh + Seed completed successfully!');
    } else {
      console.error('❌ Seeding error:', seedResult.error);
    }
  } else {
    console.log('✨ Migrate Fresh completed (without seed).');
  }

  process.exit(0);
}

migrateFresh().catch((err) => {
  console.error('Fatal error during migrate fresh:', err);
  process.exit(1);
});
