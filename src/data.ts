import type { RandBatsEntry, SmogonEntry, FormatIndex } from './types.js';

import randbatsIndex from '../data/randbats/index.json' with { type: 'json' };
import smogonIndex from '../data/smogon/index.json' with { type: 'json' };

// Eager imports for common formats
import gen9rb from '../data/randbats/gen9randombattle.json' with { type: 'json' };

const randbatsCache = new Map<string, Record<string, RandBatsEntry>>();
const smogonCache = new Map<string, Record<string, SmogonEntry>>();

// Pre-populate cache with eagerly imported data
randbatsCache.set('gen9randombattle', gen9rb as unknown as Record<string, RandBatsEntry>);

export function getRandbatsFormats(): string[] {
    return Object.keys(randbatsIndex);
}

export function getSmogonFormats(): string[] {
    return Object.keys(smogonIndex);
}

/**
 * Synchronously get cached randbats data. Returns empty object if not yet loaded.
 * gen9randombattle is always available; other formats need preloadRandbats() first.
 */
export function getRandbats(format: string): Record<string, RandBatsEntry> {
    return randbatsCache.get(format) ?? {};
}

/**
 * Asynchronously preload randbats data for a format.
 * After this resolves, getRandbats() will return the data synchronously.
 */
export async function preloadRandbats(format: string): Promise<Record<string, RandBatsEntry>> {
    if (randbatsCache.has(format)) return randbatsCache.get(format)!;
    try {
        const mod = await import(`./data/randbats/${format}.json`, { with: { type: 'json' } });
        const data = mod.default as Record<string, RandBatsEntry>;
        randbatsCache.set(format, data);
        return data;
    } catch {
        randbatsCache.set(format, {});
        return {};
    }
}

/**
 * Synchronously get cached smogon data. Returns empty object if not yet loaded.
 */
export function getSmogon(format: string): Record<string, SmogonEntry> {
    return smogonCache.get(format) ?? {};
}

/**
 * Asynchronously preload smogon data for a format.
 */
export async function preloadSmogon(format: string): Promise<Record<string, SmogonEntry>> {
    if (smogonCache.has(format)) return smogonCache.get(format)!;
    try {
        const mod = await import(`./data/smogon/${format}.json`, { with: { type: 'json' } });
        const data = mod.default as Record<string, SmogonEntry>;
        smogonCache.set(format, data);
        return data;
    } catch {
        smogonCache.set(format, {});
        return {};
    }
}
