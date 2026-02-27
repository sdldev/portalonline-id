import {
    getCollection as astroGetCollection,
    type CollectionKey,
    type CollectionEntry,
} from "astro:content";

/**
 * Type-safe wrapper around Astro's `getCollection` that silently suppresses
 * console warnings for empty or missing content collections.
 * Useful in production where some collections may be intentionally empty.
 */
export async function getCollection<
    C extends CollectionKey,
    E extends CollectionEntry<C>,
>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E,
): Promise<E[]>;

export async function getCollection<C extends CollectionKey>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown,
): Promise<CollectionEntry<C>[]>;

export async function getCollection<C extends CollectionKey>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown,
): Promise<CollectionEntry<C>[]> {
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
        if (
            typeof args[0] === "string" &&
            args[0].includes("does not exist or is empty")
        )
            return;
        originalWarn.apply(console, args as [string, ...unknown[]]);
    };
    try {
        const results = await astroGetCollection(collection, filter as never);
        return results ?? [];
    } finally {
        console.warn = originalWarn;
    }
}
