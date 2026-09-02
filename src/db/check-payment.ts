import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { neon } from '@neondatabase/serverless';

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT * FROM site_settings WHERE key LIKE 'payment%'`;
  console.log('Payment settings in DB:', JSON.stringify(rows, null, 2));
}

check();
