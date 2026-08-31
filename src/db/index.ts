import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import {
  initialHeroData,
  initialAboutData,
  initialSiteSettings,
} from './seed-data';

// In-memory fallback purely for initial single-row entities when DB is first connected
const globalState = globalThis as unknown as {
  __snorkeling_db_fallback?: {
    hero: typeof initialHeroData;
    packages: any[];
    gallery: any[];
    testimonials: any[];
    faq: any[];
    about: typeof initialAboutData;
    siteSettings: typeof initialSiteSettings;
    bookings: any[];
  };
};

if (!globalState.__snorkeling_db_fallback) {
  globalState.__snorkeling_db_fallback = {
    hero: { ...initialHeroData },
    packages: [],
    gallery: [],
    testimonials: [],
    faq: [],
    about: { ...initialAboutData },
    siteSettings: JSON.parse(JSON.stringify(initialSiteSettings)),
    bookings: [],
  };
}

export const fallbackStore = globalState.__snorkeling_db_fallback;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  try {
    const sql = neon(connectionString);
    return drizzle(sql, { schema });
  } catch (err) {
    console.warn('Could not connect to Neon DB:', err);
    return null;
  }
}

export * from './schema';
