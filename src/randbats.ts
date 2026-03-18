import type { RandBatsEntry, RandBatsRole } from './types.js';
import { getRandbats, preloadRandbats, getRandbatsFormats } from './data.js';

function toId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class RandBats {
    /**
     * Preload randbats data for a format. Call this before using other methods
     * to ensure data is available synchronously.
     */
    static preload(format: string = 'gen9randombattle'): Promise<Record<string, RandBatsEntry>> {
        return preloadRandbats(format);
    }

    /**
     * Get RandBats data for a Pokemon in a format.
     * Returns null if the format hasn't been preloaded or the Pokemon isn't found.
     */
    static get(pokemon: string, format: string = 'gen9randombattle'): RandBatsEntry | null {
        const data = getRandbats(format);
        const id = toId(pokemon);
        for (const [key, value] of Object.entries(data)) {
            if (toId(key) === id) return value;
        }
        return null;
    }

    /**
     * List all Pokemon in a RandBats format.
     */
    static list(format: string = 'gen9randombattle'): string[] {
        return Object.keys(getRandbats(format));
    }

    /**
     * Get all available RandBats formats.
     */
    static formats(): string[] {
        return getRandbatsFormats();
    }

    /**
     * Get all roles for a Pokemon.
     */
    static roles(pokemon: string, format: string = 'gen9randombattle'): Record<string, RandBatsRole> {
        return this.get(pokemon, format)?.roles ?? {};
    }

    /**
     * Get role names for a Pokemon.
     */
    static roleNames(pokemon: string, format: string = 'gen9randombattle'): string[] {
        return Object.keys(this.roles(pokemon, format));
    }

    /**
     * Get the Pokemon's level in a RandBats format.
     */
    static level(pokemon: string, format: string = 'gen9randombattle'): number | null {
        return this.get(pokemon, format)?.level ?? null;
    }

    /**
     * Get all possible items across all roles.
     */
    static items(pokemon: string, format: string = 'gen9randombattle'): string[] {
        const entry = this.get(pokemon, format);
        if (!entry) return [];
        const all = new Set<string>(entry.items ?? []);
        for (const role of Object.values(entry.roles ?? {})) {
            for (const item of role.items ?? []) all.add(item);
        }
        return [...all];
    }

    /**
     * Get all possible abilities across all roles.
     */
    static abilities(pokemon: string, format: string = 'gen9randombattle'): string[] {
        const entry = this.get(pokemon, format);
        if (!entry) return [];
        const all = new Set<string>(entry.abilities ?? []);
        for (const role of Object.values(entry.roles ?? {})) {
            for (const ability of role.abilities ?? []) all.add(ability);
        }
        return [...all];
    }

    /**
     * Get all possible moves across all roles.
     */
    static moves(pokemon: string, format: string = 'gen9randombattle'): string[] {
        const all = new Set<string>();
        for (const role of Object.values(this.roles(pokemon, format))) {
            for (const move of role.moves ?? []) all.add(move);
        }
        return [...all];
    }

    /**
     * Get all possible tera types across all roles.
     */
    static teraTypes(pokemon: string, format: string = 'gen9randombattle'): string[] {
        const all = new Set<string>();
        for (const role of Object.values(this.roles(pokemon, format))) {
            for (const type of role.teraTypes ?? []) all.add(type);
        }
        return [...all];
    }

    /**
     * Get items for a specific role.
     */
    static roleItems(pokemon: string, role: string, format: string = 'gen9randombattle'): string[] {
        return this.roles(pokemon, format)[role]?.items ?? [];
    }

    /**
     * Get moves for a specific role.
     */
    static roleMoves(pokemon: string, role: string, format: string = 'gen9randombattle'): string[] {
        return this.roles(pokemon, format)[role]?.moves ?? [];
    }

    /**
     * Get tera types for a specific role.
     */
    static roleTeraTypes(pokemon: string, role: string, format: string = 'gen9randombattle'): string[] {
        return this.roles(pokemon, format)[role]?.teraTypes ?? [];
    }
}
