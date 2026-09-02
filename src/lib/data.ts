import {
  getDb,
  fallbackStore,
  heroSection,
  packages,
  gallery,
  testimonials,
  faq,
  bookings,
  aboutSection,
  siteSettings,
} from "@/db";
import { eq, desc, asc } from "drizzle-orm";

// 1. HERO SECTION
export async function getHero() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(heroSection).limit(1);
      if (rows.length > 0) return rows[0];

      // Auto initialize default single-row in DB if empty
      const [inserted] = await db
        .insert(heroSection)
        .values(fallbackStore.hero as any)
        .returning();
      return inserted;
    } catch (e) {
      console.error("Error fetching hero from DB:", e);
      throw e;
    }
  }
  return fallbackStore.hero;
}

export async function updateHero(data: Partial<typeof fallbackStore.hero>) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(heroSection).limit(1);
      if (rows.length > 0) {
        const [updated] = await db
          .update(heroSection)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(heroSection.id, rows[0].id))
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(heroSection)
          .values(data as any)
          .returning();
        return created;
      }
    } catch (e) {
      console.error("Error updating hero in DB:", e);
      throw e;
    }
  }
  fallbackStore.hero = { ...fallbackStore.hero, ...data };
  return fallbackStore.hero;
}

// 2. PACKAGES
export async function getPackagesList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(packages)
        .orderBy(asc(packages.orderIndex));
      return rows;
    } catch (e) {
      console.error("Error fetching packages from DB:", e);
      throw e;
    }
  }
  return [];
}

export async function getPackageBySlug(slug: string) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(packages)
        .where(eq(packages.slug, slug))
        .limit(1);
      return rows[0] || null;
    } catch (e) {
      console.error("Error fetching package by slug from DB:", e);
      throw e;
    }
  }
  return null;
}

export async function createPackage(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(packages).values(data).returning();
      return created;
    } catch (e) {
      console.error("Error creating package in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function updatePackage(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .update(packages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(packages.id, id))
        .returning();
      return updated;
    } catch (e) {
      console.error("Error updating package in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function deletePackage(id: number) {
  const db = getDb();
  if (db) {
    try {
      // Disassociate package from bookings first to ensure safety against strict DB constraints
      await db
        .update(bookings)
        .set({ packageId: null })
        .where(eq(bookings.packageId, id));
      await db.delete(packages).where(eq(packages.id, id));
      return true;
    } catch (e) {
      console.error("Error deleting package from DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

// 3. GALLERY
export async function getGalleryList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(gallery)
        .orderBy(asc(gallery.orderIndex));
      return rows;
    } catch (e) {
      console.error("Error fetching gallery from DB:", e);
      throw e;
    }
  }
  return [];
}

export async function createGalleryItem(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(gallery).values(data).returning();
      return created;
    } catch (e) {
      console.error("Error creating gallery item in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function deleteGalleryItem(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(gallery).where(eq(gallery.id, id));
      return true;
    } catch (e) {
      console.error("Error deleting gallery item from DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

// 4. TESTIMONIALS
export async function getTestimonialsList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(testimonials);
      return rows;
    } catch (e) {
      console.error("Error fetching testimonials from DB:", e);
      throw e;
    }
  }
  return [];
}

export async function createTestimonial(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(testimonials).values(data).returning();
      return created;
    } catch (e) {
      console.error("Error creating testimonial in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function updateTestimonial(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .update(testimonials)
        .set(data)
        .where(eq(testimonials.id, id))
        .returning();
      return updated;
    } catch (e) {
      console.error("Error updating testimonial in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function deleteTestimonial(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, id));
      return true;
    } catch (e) {
      console.error("Error deleting testimonial from DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

// 5. FAQ
export async function getFaqList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(faq).orderBy(asc(faq.orderIndex));
      return rows;
    } catch (e) {
      console.error("Error fetching faq from DB:", e);
      throw e;
    }
  }
  return [];
}

export async function createFaq(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(faq).values(data).returning();
      return created;
    } catch (e) {
      console.error("Error creating faq in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function updateFaq(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db
        .update(faq)
        .set(data)
        .where(eq(faq.id, id))
        .returning();
      return updated;
    } catch (e) {
      console.error("Error updating faq in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function deleteFaq(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(faq).where(eq(faq.id, id));
      return true;
    } catch (e) {
      console.error("Error deleting faq from DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

// 6. BOOKINGS
export async function getBookingsList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt));
      return rows;
    } catch (e) {
      console.error("Error fetching bookings from DB:", e);
      throw e;
    }
  }
  return [];
}

export async function createBooking(data: any) {
  const db = getDb();
  const currentYear = new Date().getFullYear();
  let nextSeq = 1;

  if (db) {
    try {
      const existing = await db.select({ id: bookings.id }).from(bookings);
      nextSeq = existing.length + 1;
    } catch (e) {
      console.warn("Could not count existing bookings, fallback to 1:", e);
    }
  }

  const paddedSeq = String(nextSeq).padStart(4, "0");
  const generatedCode = `GILI-${currentYear}-${paddedSeq}`;

  const bookingPayload = {
    ...data,
    bookingCode: data.bookingCode || generatedCode,
    status: data.status || "pending",
  };

  if (db) {
    try {
      const [created] = await db
        .insert(bookings)
        .values({
          ...bookingPayload,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return created;
    } catch (e) {
      console.error("Error creating booking in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function updateBooking(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const {
        id: _id,
        createdAt: _created,
        updatedAt: _updated,
        ...cleanData
      } = data;
      const updatePayload: any = {
        ...cleanData,
        updatedAt: new Date(),
      };
      const [updated] = await db
        .update(bookings)
        .set(updatePayload)
        .where(eq(bookings.id, id))
        .returning();
      return updated;
    } catch (e) {
      console.error("Error updating booking in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

export async function updateBookingStatus(id: number, status: string) {
  return updateBooking(id, { status });
}

export async function deleteBooking(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(bookings).where(eq(bookings.id, id));
      return true;
    } catch (e) {
      console.error("Error deleting booking from DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}

// 7. ABOUT SECTION
export async function getAbout() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(aboutSection).limit(1);
      if (rows.length > 0) return rows[0];

      const [inserted] = await db
        .insert(aboutSection)
        .values(fallbackStore.about as any)
        .returning();
      return inserted;
    } catch (e) {
      console.error("Error fetching about from DB:", e);
      throw e;
    }
  }
  return fallbackStore.about;
}

export async function updateAbout(data: any) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(aboutSection).limit(1);
      if (rows.length > 0) {
        const [updated] = await db
          .update(aboutSection)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(aboutSection.id, rows[0].id))
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(aboutSection)
          .values(data)
          .returning();
        return created;
      }
    } catch (e) {
      console.error("Error updating about in DB:", e);
      throw e;
    }
  }
  fallbackStore.about = { ...fallbackStore.about, ...data };
  return fallbackStore.about;
}

// 8. SITE SETTINGS
export async function getSettings() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(siteSettings);
      if (rows.length > 0) return rows;

      // Auto seed initial settings if table is brand new
      for (const item of fallbackStore.siteSettings) {
        await db.insert(siteSettings).values(item).onConflictDoNothing();
      }
      return await db.select().from(siteSettings);
    } catch (e) {
      console.error("Error fetching settings from DB:", e);
      throw e;
    }
  }
  return fallbackStore.siteSettings;
}

export async function updateSetting(key: string, value: string) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
      if (rows.length > 0) {
        const [updated] = await db
          .update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key))
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(siteSettings)
          .values({ key, value })
          .returning();
        return created;
      }
    } catch (e) {
      console.error("Error updating setting in DB:", e);
      throw e;
    }
  }
  throw new Error("Database connection is not available");
}
