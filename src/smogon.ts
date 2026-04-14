import type { SmogonEntry, SmogonSet } from './types.js';
import { getSmogon, getSmogonFormats } from './data.js';

function toId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class Smogon {
    /**
     * Get all Smogon sets for a Pokemon in a format.
     * Returns null if format hasn't been preloaded or Pokemon isn't found.
     */
    static get(pokemon: string, format: string = 'gen9ou'): SmogonEntry | null {
        const data = getSmogon(format);
        const id = toId(pokemon);
        for (const [key, value] of Object.entries(data)) {
            if (toId(key) === id) return value;
        }
        return null;
    }

    /**
     * Get a specific named set for a Pokemon.
     */
    static getSet(pokemon: string, setName: string, format: string = 'gen9ou'): SmogonSet | null {
        const entry = this.get(pokemon, format);
        if (!entry) return null;
        return entry[setName] ?? null;
    }

    /**
     * List all set names for a Pokemon in a format.
     */
    static setNames(pokemon: string, format: string = 'gen9ou'): string[] {
        const entry = this.get(pokemon, format);
        return entry ? Object.keys(entry) : [];
    }

    /**
     * List all Pokemon in a Smogon format.
     */
    static list(format: string = 'gen9ou'): string[] {
        return Object.keys(getSmogon(format));
    }

    /**
     * Get all available Smogon formats.
     */
    static formats(): string[] {
        return getSmogonFormats();
    }

    /**
     * Search across all loaded Smogon formats for a Pokemon.
     * Only searches formats that have been preloaded.
     */
    static search(pokemon: string): Record<string, SmogonEntry> {
        const results: Record<string, SmogonEntry> = {};
        for (const format of this.formats()) {
            const entry = this.get(pokemon, format);
            if (entry) results[format] = entry;
        }
        return results;
    }
}
