import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { neon } from '@neondatabase/serverless';

async function updateWhatsAppNumber() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('No DATABASE_URL found');
    process.exit(1);
  }

  const sql = neon(url);
  console.log('Updating site_settings WhatsApp number in Neon DB...');

  // Update whatsapp_number
  const res1 = await sql`
    UPDATE "site_settings"
    SET "value" = '6282236851307'
    WHERE "key" = 'whatsapp_number'
    RETURNING *;
  `;
  console.log('Updated whatsapp_number:', res1);

  // If not existed, insert it
  if (res1.length === 0) {
    await sql`
      INSERT INTO "site_settings" ("key", "value", "section", "label")
      VALUES ('whatsapp_number', '6282236851307', 'contact', 'Nomor WhatsApp Utama (Format 62...)')
    `;
    console.log('Inserted whatsapp_number into site_settings');
  }

  // Update phone
  const res2 = await sql`
    UPDATE "site_settings"
    SET "value" = '+62 822-3685-1307'
    WHERE "key" = 'phone'
    RETURNING *;
  `;
  console.log('Updated phone:', res2);

  console.log('✅ Successfully updated WhatsApp number to +62 822-3685-1307 (6282236851307)!');
  process.exit(0);
}

updateWhatsAppNumber().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
