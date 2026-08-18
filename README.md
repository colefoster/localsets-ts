# localsets

A **local, offline package of Pokémon Showdown battle sets** — both the generated Random Battle sets (every role, item, move and Tera type a Pokémon can roll) and Smogon's curated competitive sets across 26 tiers. The JSON ships inside the package, so a lookup is a synchronous object read with no network call.

The problem it solves: knowing what a random-battle opponent *could* be running, or what the standard OU set for a Pokémon looks like, without hitting a remote API mid-battle.

Data is pulled by `scripts/pull-data.js` from two upstream repos via the `gh` CLI — [`pkmn/randbats`](https://github.com/pkmn/randbats) for the random-battle data, [`pkmn/smogon`](https://github.com/pkmn/smogon) for the analysis sets — and written as plain JSON into `data/`.

## Install

```bash
npm install localsets
```

## Use

```ts
import { RandBats, Smogon } from 'localsets';

// --- Random Battle ---
RandBats.level('Dragapult');       // 77
RandBats.roleNames('Dragapult');   // ['Fast Support', 'Fast Attacker', 'Tera Blast user', ...]
RandBats.abilities('Dragapult');   // ['Clear Body', 'Cursed Body', 'Infiltrator']
RandBats.items('Dragapult');       // ['Choice Specs', 'Heavy-Duty Boots', 'Life Orb']
RandBats.moves('Dragapult');       // every move across every role
RandBats.teraTypes('Dragapult');   // every Tera type across every role

// Narrow to one role
RandBats.roleMoves('Dragapult', 'Fast Attacker');
// → ['Draco Meteor', 'Fire Blast', 'Shadow Ball', 'U-turn']

// --- Smogon ---
Smogon.setNames('Dragapult');                  // ['Boots Pivot', 'Choice Specs', 'Choice Band', 'Mixed Offensive']
Smogon.getSet('Dragapult', 'Choice Specs');    // { moves, item, ability, nature, evs, teratypes }
Smogon.get('Dragapult', 'gen9ou');             // all sets for that format
```

Names are normalised before matching, so `'Dragapult'`, `'dragapult'` and `'Great Tusk'` / `'greattusk'` all resolve.

## API

`RandBats` — all methods take an optional trailing `format`, defaulting to `'gen9randombattle'`:

| Method | Returns |
|---|---|
| `get(pokemon, format?)` | `RandBatsEntry \| null` — the whole entry |
| `list(format?)` | `string[]` — every Pokémon in the format |
| `formats()` | `string[]` — every format in the bundled index |
| `level(pokemon, format?)` | `number \| null` |
| `roles(pokemon, format?)` | `Record<roleName, RandBatsRole>` |
| `roleNames(pokemon, format?)` | `string[]` |
| `abilities` / `items` / `moves` / `teraTypes` `(pokemon, format?)` | `string[]`, deduped across every role |
| `roleItems` / `roleMoves` / `roleTeraTypes` `(pokemon, role, format?)` | `string[]` for that one role |

`Smogon` — all methods take an optional trailing `format`, defaulting to `'gen9ou'`:

| Method | Returns |
|---|---|
| `get(pokemon, format?)` | `SmogonEntry \| null` — `Record<setName, SmogonSet>` |
| `getSet(pokemon, setName, format?)` | `SmogonSet \| null` |
| `setNames(pokemon, format?)` | `string[]` |
| `list(format?)` | `string[]` |
| `formats()` | `string[]` |
| `search(pokemon)` | `Record<format, SmogonEntry>` across all loaded formats |

Types exported: `RandBatsEntry`, `RandBatsRole`, `SmogonSet`, `SmogonEntry`.

## What's in the box

**15 Random Battle formats** (`data/randbats/`), Gen 1 through Gen 9 plus doubles, BDSP, Let's Go, Baby and Godly Gift:

```
gen9randombattle 508    gen9randomdoublesbattle 504    gen9godlygiftrandombattle 508
gen9babyrandombattle 245    gen8randombattle 457    gen8randomdoublesbattle 446
gen8bdsprandombattle 296    gen7randombattle 575    gen7letsgorandombattle 97
gen6randombattle 483    gen5randombattle 389    gen4randombattle 296
gen3randombattle 220    gen2randombattle 141    gen1randombattle 146
```

**26 Smogon formats** (`data/smogon/`) — Gen 9 across OU, UU, RU, NU, PU, Ubers, AG, Doubles OU, Monotype, LC, National Dex and VGC 2024/2025; Gen 8 OU/UU/Ubers/Doubles OU; Gen 7 OU/UU/Ubers; and OU alone for Gens 1–6. `data/smogon/index.json` and `data/randbats/index.json` carry the format → Pokémon-count listing that `formats()` reads.

## Scripts

```bash
npm run pull-data    # re-fetch data/ from pkmn/randbats + pkmn/smogon (needs `gh` authed)
npm run build        # tsc → dist/
```

`prepublishOnly` runs both, so a publish always ships freshly pulled sets.

## Known limitations

- **Only `gen9randombattle` is loaded by default.** `src/data.ts` statically imports that one file and caches it; every other format is registered lazily via `setRandbats` / `setSmogon`, which are **not re-exported from the package entry point**. From an installed copy, `RandBats.get(x, 'gen8randombattle')` and every `Smogon` lookup return empty until that plumbing is exposed — the JSON is on disk in `data/`, but the public API can't yet reach it. `formats()` still lists everything, because it reads the index files.
- **The `SmogonSet` type is narrower than the real data.** Upstream sets express slot alternatives as nested arrays (`moves: [["Dragon Darts", "Draco Meteor"], "Hex", ...]`) and sometimes give `evs` as an array of spreads. The declared type says `moves: string[]` and `evs?: Record<string, number>`, so those cases are mistyped at compile time even though the runtime value is correct.
- **The data is a snapshot**, taken at the last `pull-data` run. Upstream randbats data changes with every Showdown balance pass.
