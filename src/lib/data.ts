import { getDb, fallbackStore, heroSection, packages, gallery, testimonials, faq, bookings, aboutSection, siteSettings } from '@/db';
import { eq, desc, asc } from 'drizzle-orm';

// 1. HERO SECTION
export async function getHero() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(heroSection).limit(1);
      if (rows.length > 0) return rows[0];
    } catch (e) {
      console.error('Error fetching hero from DB:', e);
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
        const [updated] = await db.update(heroSection).set({ ...data, updatedAt: new Date() }).where(eq(heroSection.id, rows[0].id)).returning();
        return updated;
      } else {
        const [created] = await db.insert(heroSection).values(data as any).returning();
        return created;
      }
    } catch (e) {
      console.error('Error updating hero in DB:', e);
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
      const rows = await db.select().from(packages).orderBy(asc(packages.orderIndex));
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error('Error fetching packages from DB:', e);
    }
  }
  return fallbackStore.packages;
}

export async function getPackageBySlug(slug: string) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
      if (rows.length > 0) return rows[0];
    } catch (e) {
      console.error('Error fetching package by slug from DB:', e);
    }
  }
  return fallbackStore.packages.find((p) => p.slug === slug) || null;
}

export async function createPackage(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(packages).values(data).returning();
      return created;
    } catch (e) {
      console.error('Error creating package in DB:', e);
    }
  }
  const newId = (fallbackStore.packages.length > 0 ? Math.max(...fallbackStore.packages.map((p) => p.id)) : 0) + 1;
  const newItem = { id: newId, ...data };
  fallbackStore.packages.push(newItem);
  return newItem;
}

export async function updatePackage(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db.update(packages).set({ ...data, updatedAt: new Date() }).where(eq(packages.id, id)).returning();
      return updated;
    } catch (e) {
      console.error('Error updating package in DB:', e);
    }
  }
  const index = fallbackStore.packages.findIndex((p) => p.id === id);
  if (index !== -1) {
    fallbackStore.packages[index] = { ...fallbackStore.packages[index], ...data };
    return fallbackStore.packages[index];
  }
  return null;
}

export async function deletePackage(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(packages).where(eq(packages.id, id));
      return true;
    } catch (e) {
      console.error('Error deleting package from DB:', e);
    }
  }
  fallbackStore.packages = fallbackStore.packages.filter((p) => p.id !== id);
  return true;
}

// 3. GALLERY
export async function getGalleryList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(gallery).orderBy(asc(gallery.orderIndex));
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error('Error fetching gallery from DB:', e);
    }
  }
  return fallbackStore.gallery;
}

export async function createGalleryItem(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(gallery).values(data).returning();
      return created;
    } catch (e) {
      console.error('Error creating gallery item in DB:', e);
    }
  }
  const newId = (fallbackStore.gallery.length > 0 ? Math.max(...fallbackStore.gallery.map((g) => g.id)) : 0) + 1;
  const newItem = { id: newId, ...data };
  fallbackStore.gallery.push(newItem);
  return newItem;
}

export async function deleteGalleryItem(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(gallery).where(eq(gallery.id, id));
      return true;
    } catch (e) {
      console.error('Error deleting gallery item from DB:', e);
    }
  }
  fallbackStore.gallery = fallbackStore.gallery.filter((g) => g.id !== id);
  return true;
}

// 4. TESTIMONIALS
export async function getTestimonialsList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(testimonials);
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error('Error fetching testimonials from DB:', e);
    }
  }
  return fallbackStore.testimonials;
}

export async function createTestimonial(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(testimonials).values(data).returning();
      return created;
    } catch (e) {
      console.error('Error creating testimonial in DB:', e);
    }
  }
  const newId = (fallbackStore.testimonials.length > 0 ? Math.max(...fallbackStore.testimonials.map((t) => t.id)) : 0) + 1;
  const newItem = { id: newId, ...data };
  fallbackStore.testimonials.push(newItem);
  return newItem;
}

export async function updateTestimonial(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
      return updated;
    } catch (e) {
      console.error('Error updating testimonial in DB:', e);
    }
  }
  const index = fallbackStore.testimonials.findIndex((t) => t.id === id);
  if (index !== -1) {
    fallbackStore.testimonials[index] = { ...fallbackStore.testimonials[index], ...data };
    return fallbackStore.testimonials[index];
  }
  return null;
}

export async function deleteTestimonial(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(testimonials).where(eq(testimonials.id, id));
      return true;
    } catch (e) {
      console.error('Error deleting testimonial from DB:', e);
    }
  }
  fallbackStore.testimonials = fallbackStore.testimonials.filter((t) => t.id !== id);
  return true;
}

// 5. FAQ
export async function getFaqList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(faq).orderBy(asc(faq.orderIndex));
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error('Error fetching faq from DB:', e);
    }
  }
  return fallbackStore.faq;
}

export async function createFaq(data: any) {
  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(faq).values(data).returning();
      return created;
    } catch (e) {
      console.error('Error creating faq in DB:', e);
    }
  }
  const newId = (fallbackStore.faq.length > 0 ? Math.max(...fallbackStore.faq.map((f) => f.id)) : 0) + 1;
  const newItem = { id: newId, ...data };
  fallbackStore.faq.push(newItem);
  return newItem;
}

export async function updateFaq(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db.update(faq).set(data).where(eq(faq.id, id)).returning();
      return updated;
    } catch (e) {
      console.error('Error updating faq in DB:', e);
    }
  }
  const index = fallbackStore.faq.findIndex((f) => f.id === id);
  if (index !== -1) {
    fallbackStore.faq[index] = { ...fallbackStore.faq[index], ...data };
    return fallbackStore.faq[index];
  }
  return null;
}

export async function deleteFaq(id: number) {
  const db = getDb();
  if (db) {
    try {
      await db.delete(faq).where(eq(faq.id, id));
      return true;
    } catch (e) {
      console.error('Error deleting faq from DB:', e);
    }
  }
  fallbackStore.faq = fallbackStore.faq.filter((f) => f.id !== id);
  return true;
}

// 6. BOOKINGS
export async function getBookingsList() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
      if (rows.length > 0) return rows;
    } catch (e) {
      console.error('Error fetching bookings from DB:', e);
    }
  }
  return fallbackStore.bookings;
}

export async function createBooking(data: any) {
  const code = `GILI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const bookingPayload = {
    ...data,
    bookingCode: code,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: data.status || 'pending',
  };

  const db = getDb();
  if (db) {
    try {
      const [created] = await db.insert(bookings).values({
        ...bookingPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return created;
    } catch (e) {
      console.error('Error creating booking in DB:', e);
    }
  }

  const newId = (fallbackStore.bookings.length > 0 ? Math.max(...fallbackStore.bookings.map((b) => b.id)) : 0) + 1;
  const newItem = { id: newId, ...bookingPayload };
  fallbackStore.bookings.unshift(newItem);
  return newItem;
}

export async function updateBooking(id: number, data: any) {
  const db = getDb();
  if (db) {
    try {
      const [updated] = await db.update(bookings).set({ ...data, updatedAt: new Date() }).where(eq(bookings.id, id)).returning();
      return updated;
    } catch (e) {
      console.error('Error updating booking in DB:', e);
    }
  }
  const index = fallbackStore.bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    fallbackStore.bookings[index] = {
      ...fallbackStore.bookings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return fallbackStore.bookings[index];
  }
  return null;
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
      console.error('Error deleting booking from DB:', e);
    }
  }
  fallbackStore.bookings = fallbackStore.bookings.filter((b) => b.id !== id);
  return true;
}

// 7. ABOUT SECTION
export async function getAbout() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(aboutSection).limit(1);
      if (rows.length > 0) return rows[0];
    } catch (e) {
      console.error('Error fetching about from DB:', e);
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
        const [updated] = await db.update(aboutSection).set({ ...data, updatedAt: new Date() }).where(eq(aboutSection.id, rows[0].id)).returning();
        return updated;
      } else {
        const [created] = await db.insert(aboutSection).values(data).returning();
        return created;
      }
    } catch (e) {
      console.error('Error updating about in DB:', e);
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
    } catch (e) {
      console.error('Error fetching settings from DB:', e);
    }
  }
  return fallbackStore.siteSettings;
}

export async function updateSetting(key: string, value: string) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (rows.length > 0) {
        const [updated] = await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key)).returning();
        return updated;
      } else {
        const [created] = await db.insert(siteSettings).values({ key, value }).returning();
        return created;
      }
    } catch (e) {
      console.error('Error updating setting in DB:', e);
    }
  }
  const index = fallbackStore.siteSettings.findIndex((s) => s.key === key);
  if (index !== -1) {
    fallbackStore.siteSettings[index].value = value;
    return fallbackStore.siteSettings[index];
  } else {
    const newSetting = { key, value, section: 'general', label: key };
    fallbackStore.siteSettings.push(newSetting);
    return newSetting;
  }
}
