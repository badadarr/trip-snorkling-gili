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

    await sql`ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "price_eur" double precision DEFAULT 0;`;
    console.log('✅ Column "price_eur" ensured in "packages"');

    // Gallery Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS "gallery_categories" (
        "id" SERIAL PRIMARY KEY,
        "key" TEXT UNIQUE NOT NULL,
        "label_id" TEXT NOT NULL,
        "label_en" TEXT NOT NULL,
        "order_index" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Table "gallery_categories" ensured');

    // Seed default categories if table is empty
    const existing = await sql`SELECT COUNT(*) as cnt FROM gallery_categories;`;
    if (Number(existing[0]?.cnt) === 0) {
      await sql`
        INSERT INTO "gallery_categories" ("key", "label_id", "label_en", "order_index")
        VALUES
          ('turtles', 'Penyu (Turtles)', 'Turtles', 1),
          ('statues', 'Patung Bawah Laut', 'Underwater Statues', 2),
          ('underwater', 'Karang & Ikan', 'Coral & Fish', 3),
          ('sunset', 'Sunset & Pantai', 'Sunset & Beach', 4),
          ('boats', 'Kapal Glass Bottom', 'Glass Bottom Boats', 5)
        ON CONFLICT ("key") DO NOTHING;
      `;
      console.log('✅ Default gallery categories seeded');
    } else {
      console.log('ℹ️  Gallery categories already exist, skipping seed');
    }

    console.log('🎉 Safe database migration completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateSafe();
