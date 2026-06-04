import type { ProfileId, Taggable } from "@/types";

/**
 * Data-driven filtering by loadout. Returns the items tagged with `profileId`,
 * with `featured` items sorted first (stable for everything else).
 *
 * Every section consumes data that has already passed through this function, so
 * switching loadouts re-filters all content from a single, typed source.
 */
export function byProfile<T extends Taggable>(
  items: T[],
  profileId: ProfileId,
): T[] {
  return items
    .filter((item) => item.tags.includes(profileId))
    .sort((a, b) => featuredRank(a) - featuredRank(b));
}

function featuredRank(item: Taggable): number {
  return "featured" in item && (item as { featured?: boolean }).featured
    ? 0
    : 1;
}

/** Group filtered items by their optional `group` field, preserving order. */
export function groupBy<T extends { group?: string }>(
  items: T[],
  fallback = "GENERAL",
): Array<{ group: string; items: T[] }> {
  const order: string[] = [];
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = item.group ?? fallback;
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map((group) => ({ group, items: map.get(group)! }));
}
