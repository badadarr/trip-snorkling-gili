/**
 * Cache tags for the public site's data layer.
 *
 * Public pages read through `@/lib/public-data`, which caches every query in the
 * Next.js Data Cache. Admin writes call `revalidatePublicData()` so an edit in
 * the dashboard shows up on the public site immediately instead of waiting for
 * the time-based revalidation window to expire.
 */
export const CACHE_TAGS = {
  hero: 'public:hero',
  packages: 'public:packages',
  gallery: 'public:gallery',
  galleryCategories: 'public:gallery-categories',
  testimonials: 'public:testimonials',
  faq: 'public:faq',
  about: 'public:about',
  settings: 'public:settings',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/**
 * How long a cached query is served before it is refetched from Postgres.
 *
 * This is deliberately long. Every admin write invalidates its tag, so edits
 * made through the dashboard appear immediately regardless of this value --
 * the timer is only a safety net for content changed outside the app (a seed
 * script, or hand-written SQL).
 *
 * Keeping it short would be actively harmful on a metered database: images are
 * currently stored as base64 inside Postgres, so one refetch pulls the whole
 * gallery over the wire. At a 5 minute window that is ~8,600 full reads a
 * month, which is what exhausts a data-transfer quota even with caching in
 * place. Once images move to object storage this can safely be lowered again.
 */
export const PUBLIC_REVALIDATE_SECONDS = 60 * 60 * 24;
