import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from 'react';
type Callback = (...args: any[]) => Promise<any>


/**
 * Wrap a function with Next.js's built-in caching mechanism.
 *
 * @param cb The callback function to be cached
 * @param keyParts The parts of the cache key
 * @param options The caching options
 * @returns The cached function
 */
export function cache<T extends Callback>(
    cb: T,
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } = {}
): T {
    /**
     * The cache key is composed of the parts provided in `keyParts`.
     * We use Next.js's `cache` function to wrap the function and provide the cache options.
     */
    return nextCache(reactCache(cb), keyParts, options)
}
