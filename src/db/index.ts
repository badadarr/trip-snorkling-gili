import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import {
  initialHeroData,
  initialPackagesData,
  initialGalleryData,
  initialTestimonialsData,
  initialFaqData,
  initialAboutData,
  initialSiteSettings,
} from './seed-data';

// Singleton in-memory state for dev / fallback when DATABASE_URL is not yet set
const globalState = globalThis as unknown as {
  __snorkeling_db_fallback?: {
    hero: typeof initialHeroData;
    packages: typeof initialPackagesData;
    gallery: typeof initialGalleryData;
    testimonials: typeof initialTestimonialsData;
    faq: typeof initialFaqData;
    about: typeof initialAboutData;
    siteSettings: typeof initialSiteSettings;
    bookings: Array<{
      id: number;
      bookingCode: string;
      packageId?: number | null;
      packageName: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      numberOfPeople: number;
      tripDate: string;
      tripSession?: string;
      pickupLocation?: string;
      specialRequests?: string;
      totalPriceIdr: number;
      totalPriceUsd?: number;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
};

if (!globalState.__snorkeling_db_fallback) {
  globalState.__snorkeling_db_fallback = {
    hero: { ...initialHeroData },
    packages: JSON.parse(JSON.stringify(initialPackagesData)),
    gallery: JSON.parse(JSON.stringify(initialGalleryData)),
    testimonials: JSON.parse(JSON.stringify(initialTestimonialsData)),
    faq: JSON.parse(JSON.stringify(initialFaqData)),
    about: JSON.parse(JSON.stringify(initialAboutData)),
    siteSettings: JSON.parse(JSON.stringify(initialSiteSettings)),
    bookings: [
      {
        id: 1,
        bookingCode: 'GILI-2026-8801',
        packageId: 1,
        packageName: 'Public Sharing Trip (3 Gili)',
        customerName: 'Alex Morrison',
        customerEmail: 'alex.morrison@gmail.com',
        customerPhone: '+61412345678',
        numberOfPeople: 2,
        tripDate: '2026-08-28',
        tripSession: 'morning (09:30)',
        pickupLocation: 'Vila Ombak Gili Trawangan',
        specialRequests: 'Need 1 smaller life jacket for my partner',
        totalPriceIdr: 300000,
        totalPriceUsd: 20,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        bookingCode: 'GILI-2026-8802',
        packageId: 2,
        packageName: 'Private Glass Bottom Boat Trip',
        customerName: 'Budi Santoso',
        customerEmail: 'budi.santoso@yahoo.com',
        customerPhone: '+6281298765432',
        numberOfPeople: 4,
        tripDate: '2026-08-29',
        tripSession: '08:30 WITA',
        pickupLocation: 'Aston Sunset Beach Resort',
        specialRequests: 'Tolong bawa roti tambahan untuk fish feeding anak-anak',
        totalPriceIdr: 850000,
        totalPriceUsd: 55,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
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
    console.warn('Could not connect to Neon DB with provided DATABASE_URL, falling back to cached state:', err);
    return null;
  }
}

export * from './schema';
