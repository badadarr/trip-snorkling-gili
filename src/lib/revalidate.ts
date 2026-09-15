import { revalidateTag } from 'next/cache';
import { CACHE_TAGS, type CacheTag } from '@/lib/cache-tags';

/**
 * Drops the cached public-site copy of the given content so the next visitor
 * sees the admin's change immediately. Call this from a route handler after a
 * successful write.
 *
 * `{ expire: 0 }` means the stale entry must not be served at all once the tag
 * is invalidated -- without it Next.js is free to keep serving the previous
 * version while it refetches, which would look to the admin like the save had
 * silently failed.
 *
 * Revalidation is best-effort: a failure here means visitors keep seeing the
 * previous version until the time-based window expires, which must never turn a
 * successful save into a failed API response.
 */
export function revalidatePublicData(...tags: CacheTag[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch (e) {
      console.error(`[revalidate] Could not revalidate tag "${tag}":`, e);
    }
  }
}

/** Drops every cached public query. For bulk writes such as re-seeding. */
export function revalidateAllPublicData(): void {
  revalidatePublicData(...Object.values(CACHE_TAGS));
}

export { CACHE_TAGS };
