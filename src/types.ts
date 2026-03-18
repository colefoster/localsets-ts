export interface RandBatsRole {
    abilities?: string[];
    items?: string[];
    moves?: string[];
    teraTypes?: string[];
    evs?: Record<string, number>;
    ivs?: Record<string, number>;
}

export interface RandBatsEntry {
    level?: number;
    abilities?: string[];
    items?: string[];
    roles?: Record<string, RandBatsRole>;
}

export interface SmogonSet {
    moves: string[];
    item?: string | string[];
    ability?: string | string[];
    nature?: string | string[];
    evs?: Record<string, number>;
    ivs?: Record<string, number>;
    teratypes?: string | string[];
}

export type SmogonEntry = Record<string, SmogonSet>;

export interface FormatIndex {
    [format: string]: number;
}
