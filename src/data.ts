import type { RandBatsEntry, SmogonEntry, FormatIndex } from './types.js';

import randbatsIndex from '../data/randbats/index.json' with { type: 'json' };
import smogonIndex from '../data/smogon/index.json' with { type: 'json' };

// Eager imports for supported formats
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
 * gen9randombattle is always available.
 */
export function getRandbats(format: string): Record<string, RandBatsEntry> {
    return randbatsCache.get(format) ?? {};
}

/**
 * Register randbats data for a format into the cache.
 */
export function setRandbats(format: string, data: Record<string, RandBatsEntry>): void {
    randbatsCache.set(format, data);
}

/**
 * Synchronously get cached smogon data. Returns empty object if not yet loaded.
 */
export function getSmogon(format: string): Record<string, SmogonEntry> {
    return smogonCache.get(format) ?? {};
}

/**
 * Register smogon data for a format into the cache.
 */
export function setSmogon(format: string, data: Record<string, SmogonEntry>): void {
    smogonCache.set(format, data);
}
