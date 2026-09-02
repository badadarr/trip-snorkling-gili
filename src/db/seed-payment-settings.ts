import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { neon } from '@neondatabase/serverless';

async function seedPaymentSettings() {
  const url = process.env.DATABASE_URL;
  if (!url) process.exit(1);

  const sql = neon(url);
  console.log('Seeding initial payment settings into Neon DB...');

  const settingsToEnsure = [
    { key: "payment_qris_active", value: "true", section: "payment", label: "Status Aktif QRIS" },
    { key: "payment_qris_name", value: "Trip Snorkeling Gili Trawangan", section: "payment", label: "Nama Merchant QRIS" },
    { key: "payment_qris_image", value: "", section: "payment", label: "Gambar QR Code QRIS" },
    { key: "payment_bank_active", value: "true", section: "payment", label: "Status Aktif Transfer Bank" },
    { key: "payment_bank_name", value: "Bank Central Asia (BCA)", section: "payment", label: "Nama Bank" },
    { key: "payment_bank_number", value: "8735-0123-4567", section: "payment", label: "Nomor Rekening Bank" },
    { key: "payment_bank_holder", value: "Trip Snorkeling Gili", section: "payment", label: "Nama Pemilik Rekening" },
    { key: "payment_bank_notes", value: "Mohon cantumkan Kode Booking pada berita transfer.", section: "payment", label: "Catatan Transfer Bank" }
  ];

  for (const item of settingsToEnsure) {
    const existing = await sql`SELECT * FROM "site_settings" WHERE "key" = ${item.key}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO "site_settings" ("key", "value", "section", "label")
        VALUES (${item.key}, ${item.value}, ${item.section}, ${item.label})
      `;
      console.log(`Inserted ${item.key}`);
    }
  }

  console.log('✅ Payment settings seeded in DB!');
  process.exit(0);
}

seedPaymentSettings().catch((e) => {
  console.error(e);
  process.exit(1);
});
