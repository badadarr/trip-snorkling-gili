import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { seedDatabase } from './seed';

async function main() {
  console.log('🚀 Running Drizzle Database Seeder...');
  const result = await seedDatabase();
  if (result.success) {
    console.log('✨ Data seeding finished successfully!');
    process.exit(0);
  } else {
    console.error('❌ Seeding failed:', result.message || result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error during seed execution:', err);
  process.exit(1);
});
