import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { neon } from '@neondatabase/serverless';

async function migrateSafe() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ Error: No DATABASE_URL found in .env.local or .env');
    process.exit(1);
  }

  console.log('🔄 Connecting to Neon DB for safe column migration...');
  const sql = neon(url);

  try {
    await sql`ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "payment_method" varchar(50) DEFAULT 'qris';`;
    console.log('✅ Column "payment_method" ensured in "bookings"');

    await sql`ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "payment_proof_url" text;`;
    console.log('✅ Column "payment_proof_url" ensured in "bookings"');

    await sql`ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "price_unit" varchar(30) DEFAULT 'per_person';`;
    console.log('✅ Column "price_unit" ensured in "packages"');

    console.log('🎉 Safe database migration completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateSafe();
