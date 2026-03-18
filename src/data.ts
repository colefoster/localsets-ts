import { createRequire } from 'module';
import type { RandBatsEntry, SmogonEntry, FormatIndex } from './types.js';

const require = createRequire(import.meta.url);

const randbatsCache = new Map<string, Record<string, RandBatsEntry>>();
const smogonCache = new Map<string, Record<string, SmogonEntry>>();

export function getRandbatsFormats(): string[] {
    const index: FormatIndex = require('../data/randbats/index.json');
    return Object.keys(index);
}

export function getSmogonFormats(): string[] {
    const index: FormatIndex = require('../data/smogon/index.json');
    return Object.keys(index);
}

export function loadRandbats(format: string): Record<string, RandBatsEntry> {
    if (randbatsCache.has(format)) return randbatsCache.get(format)!;
    try {
        const data = require(`../data/randbats/${format}.json`);
        randbatsCache.set(format, data);
        return data;
    } catch {
        return {};
    }
}

export function loadSmogon(format: string): Record<string, SmogonEntry> {
    if (smogonCache.has(format)) return smogonCache.get(format)!;
    try {
        const data = require(`../data/smogon/${format}.json`);
        smogonCache.set(format, data);
        return data;
    } catch {
        return {};
    }
}
