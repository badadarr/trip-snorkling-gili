import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import {
  initialHeroData,
  initialPackagesData,
  initialGalleryData,
  initialTestimonialsData,
  initialFaqData,
  initialAboutData,
  initialSiteSettings,
} from './seed-data';

export async function seedDatabase(dbUrl?: string) {
  const url = dbUrl || process.env.DATABASE_URL;
  if (!url) {
    console.log('No DATABASE_URL provided, skipping DB seed.');
    return { success: false, message: 'DATABASE_URL is not set' };
  }

  try {
    const sql = neon(url);
    const db = drizzle(sql, { schema });

    console.log('🌱 Starting database seeding / syncing to Neon PostgreSQL...');

    // 1. Hero
    const existingHero = await db.select().from(schema.heroSection).limit(1);
    if (existingHero.length === 0) {
      await db.insert(schema.heroSection).values({
        badgeId: initialHeroData.badgeId,
        badgeEn: initialHeroData.badgeEn,
        titleId: initialHeroData.titleId,
        titleEn: initialHeroData.titleEn,
        subtitleId: initialHeroData.subtitleId,
        subtitleEn: initialHeroData.subtitleEn,
        backgroundImage: initialHeroData.backgroundImage,
        ctaTextId: initialHeroData.ctaTextId,
        ctaTextEn: initialHeroData.ctaTextEn,
        ctaLink: initialHeroData.ctaLink,
        secondaryCtaId: initialHeroData.secondaryCtaId,
        secondaryCtaEn: initialHeroData.secondaryCtaEn,
        secondaryCtaLink: initialHeroData.secondaryCtaLink,
      });
      console.log('✅ Hero section seeded');
    }

    // 2. Packages
    const existingPackages = await db.select().from(schema.packages).limit(1);
    if (existingPackages.length === 0) {
      for (const pkg of initialPackagesData) {
        await db.insert(schema.packages).values({
          slug: pkg.slug,
          nameId: pkg.nameId,
          nameEn: pkg.nameEn,
          tagId: pkg.tagId,
          tagEn: pkg.tagEn,
          descriptionId: pkg.descriptionId,
          descriptionEn: pkg.descriptionEn,
          price: pkg.price,
          priceUsd: pkg.priceUsd,
          durationId: pkg.durationId,
          durationEn: pkg.durationEn,
          scheduleId: pkg.scheduleId,
          scheduleEn: pkg.scheduleEn,
          includesId: pkg.includesId,
          includesEn: pkg.includesEn,
          spotsId: pkg.spotsId,
          spotsEn: pkg.spotsEn,
          imageUrl: pkg.imageUrl,
          priceUnit: (pkg as any).priceUnit || 'per_person',
          isFeatured: pkg.isFeatured,
          isActive: pkg.isActive,
          orderIndex: pkg.orderIndex,
        });
      }
      console.log('✅ Packages seeded');
    }

    // 3. Gallery
    const existingGallery = await db.select().from(schema.gallery).limit(1);
    if (existingGallery.length === 0) {
      for (const item of initialGalleryData) {
        await db.insert(schema.gallery).values({
          imageUrl: item.imageUrl,
          titleId: item.titleId,
          titleEn: item.titleEn,
          category: item.category,
          orderIndex: item.orderIndex,
        });
      }
      console.log('✅ Gallery seeded');
    }

    // 4. Testimonials
    const existingTestimonials = await db.select().from(schema.testimonials).limit(1);
    if (existingTestimonials.length === 0) {
      for (const t of initialTestimonialsData) {
        await db.insert(schema.testimonials).values({
          name: t.name,
          origin: t.origin,
          countryCode: t.countryCode,
          rating: t.rating,
          tripType: t.tripType,
          contentId: t.contentId,
          contentEn: t.contentEn,
          avatarUrl: t.avatarUrl,
          isActive: t.isActive,
        });
      }
      console.log('✅ Testimonials seeded');
    }

    // 5. FAQ
    const existingFaq = await db.select().from(schema.faq).limit(1);
    if (existingFaq.length === 0) {
      for (const f of initialFaqData) {
        await db.insert(schema.faq).values({
          questionId: f.questionId,
          questionEn: f.questionEn,
          answerId: f.answerId,
          answerEn: f.answerEn,
          category: f.category,
          orderIndex: f.orderIndex,
          isActive: f.isActive,
        });
      }
      console.log('✅ FAQ seeded');
    }

    // 6. About
    const existingAbout = await db.select().from(schema.aboutSection).limit(1);
    if (existingAbout.length === 0) {
      await db.insert(schema.aboutSection).values({
        titleId: initialAboutData.titleId,
        titleEn: initialAboutData.titleEn,
        subtitleId: initialAboutData.subtitleId,
        subtitleEn: initialAboutData.subtitleEn,
        storyId: initialAboutData.storyId,
        storyEn: initialAboutData.storyEn,
        imageUrl: initialAboutData.imageUrl,
        stats: initialAboutData.stats,
      });
      console.log('✅ About section seeded');
    }

    // 7. Site Settings
    const existingSettings = await db.select().from(schema.siteSettings).limit(1);
    if (existingSettings.length === 0) {
      for (const s of initialSiteSettings) {
        await db.insert(schema.siteSettings).values({
          key: s.key,
          value: s.value,
          section: s.section,
          label: s.label,
        });
      }
      console.log('✅ Site settings seeded');
    }

    // 8. Admin User
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@skt.com';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const existingAdmin = await db.select().from(schema.admins).where(eq(schema.admins.email, adminEmail.toLowerCase())).limit(1);
    if (existingAdmin.length === 0) {
      const bcrypt = (await import('bcryptjs')).default;
      const passwordHash = await bcrypt.hash(adminPass, 10);
      await db.insert(schema.admins).values({
        email: adminEmail.toLowerCase(),
        passwordHash,
        name: 'Admin Trip Snorkeling',
        role: 'superadmin',
      });
      console.log('✅ Superadmin user seeded into Neon database');
    }

    console.log('🎉 Seeding & sync completed successfully!');
    return { success: true, message: 'Database synced successfully' };
  } catch (error: any) {
    console.error('❌ Error during seeding:', error);
    return { success: false, error: error.message };
  }
}
