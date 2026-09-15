/**
 * Read-only data access for the public site.
 *
 * Every getter here does two things that the raw functions in `@/lib/data` do not:
 *
 * 1. **Caches the query.** The public pages are the same for every visitor, so
 *    hitting Postgres on each request only burns the database's data-transfer
 *    quota. Results are stored in the Next.js Data Cache, shared across requests
 *    and serverless instances, and invalidated by tag when an admin saves.
 *
 * 2. **Degrades instead of crashing.** If the database is unreachable the raw
 *    getters throw, which fails the Server Component render and turns the whole
 *    page into a 500. Here a failed read falls back to the seed defaults so the
 *    site stays up with whatever content can be shown.
 *
 * Admin screens must NOT use this module -- they need to read their own writes
 * immediately, so they keep importing the uncached getters from `@/lib/data`.
 *
 * Note: `unstable_cache` is superseded by the `use cache` directive in Next 16,
 * but `use cache` requires opting the whole app into Cache Components. This is
 * the equivalent that works without that migration.
 */
import { unstable_cache } from 'next/cache';
import { fallbackStore } from '@/db';
import {
  defaultGalleryCategories,
  getHero as readHero,
  getPackagesList as readPackagesList,
  getPackageBySlug as readPackageBySlug,
  getGalleryList as readGalleryList,
  getGalleryCategories as readGalleryCategories,
  getTestimonialsList as readTestimonialsList,
  getFaqList as readFaqList,
  getAbout as readAbout,
  getSettings as readSettings,
} from '@/lib/data';
import { CACHE_TAGS, PUBLIC_REVALIDATE_SECONDS } from '@/lib/cache-tags';

/**
 * Wraps a raw getter in the Data Cache.
 *
 * The raw getter is left free to throw: a rejected promise is not written to the
 * cache, so a database outage never gets "stuck" as a cached empty result. The
 * caller is responsible for turning that rejection into a fallback value.
 */
function cached<Args extends unknown[], Result>(
  key: string,
  tag: string,
  read: (...args: Args) => Promise<Result>,
) {
  return unstable_cache(read, ['public-data', key], {
    tags: [tag],
    revalidate: PUBLIC_REVALIDATE_SECONDS,
  });
}

function onReadFailure(what: string, error: unknown): void {
  console.error(
    `[public-data] Falling back to defaults, could not read "${what}" from the database:`,
    error,
  );
}

const heroCached = cached('hero', CACHE_TAGS.hero, readHero);
const packagesListCached = cached('packages-list', CACHE_TAGS.packages, readPackagesList);
const packageBySlugCached = cached('package-by-slug', CACHE_TAGS.packages, readPackageBySlug);
const galleryListCached = cached('gallery-list', CACHE_TAGS.gallery, readGalleryList);
const galleryCategoriesCached = cached(
  'gallery-categories',
  CACHE_TAGS.galleryCategories,
  readGalleryCategories,
);
const testimonialsListCached = cached(
  'testimonials-list',
  CACHE_TAGS.testimonials,
  readTestimonialsList,
);
const faqListCached = cached('faq-list', CACHE_TAGS.faq, readFaqList);
const aboutCached = cached('about', CACHE_TAGS.about, readAbout);
const settingsCached = cached('settings', CACHE_TAGS.settings, readSettings);

export async function getHero() {
  try {
    return await heroCached();
  } catch (e) {
    onReadFailure('hero', e);
    return fallbackStore.hero;
  }
}

export async function getPackagesList() {
  try {
    return await packagesListCached();
  } catch (e) {
    onReadFailure('packages', e);
    return [];
  }
}

export async function getPackageBySlug(slug: string) {
  try {
    return await packageBySlugCached(slug);
  } catch (e) {
    onReadFailure(`package "${slug}"`, e);
    return null;
  }
}

export async function getGalleryList() {
  try {
    return await galleryListCached();
  } catch (e) {
    onReadFailure('gallery', e);
    return [];
  }
}

export async function getGalleryCategories() {
  try {
    return await galleryCategoriesCached();
  } catch (e) {
    onReadFailure('gallery categories', e);
    return defaultGalleryCategories.map((c, i) => ({
      id: i + 1,
      ...c,
      createdAt: new Date(),
    }));
  }
}

export async function getTestimonialsList() {
  try {
    return await testimonialsListCached();
  } catch (e) {
    onReadFailure('testimonials', e);
    return [];
  }
}

export async function getFaqList() {
  try {
    return await faqListCached();
  } catch (e) {
    onReadFailure('faq', e);
    return [];
  }
}

export async function getAbout() {
  try {
    return await aboutCached();
  } catch (e) {
    onReadFailure('about', e);
    return fallbackStore.about;
  }
}

export async function getSettings() {
  try {
    return await settingsCached();
  } catch (e) {
    onReadFailure('settings', e);
    return fallbackStore.siteSettings;
  }
}
