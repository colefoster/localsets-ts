/**
 * Pulls RandBats data from pkmn/randbats and Smogon sets from pkmn/smogon.
 * Both repos provide pre-built JSON files.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const RANDBATS_DIR = join(DATA_DIR, 'randbats');
const SMOGON_DIR = join(DATA_DIR, 'smogon');

function fetchJson(repo, path) {
    const out = execSync(
        `gh api repos/${repo}/contents/${path} -H 'Accept: application/vnd.github.raw+json'`,
        { maxBuffer: 50 * 1024 * 1024 }
    );
    return JSON.parse(out.toString());
}

function fetchFileList(repo, path) {
    const out = execSync(
        `gh api repos/${repo}/contents/${path} --jq '.[].name'`,
        { maxBuffer: 10 * 1024 * 1024 }
    );
    return out.toString().trim().split('\n').filter(f => f.endsWith('.json'));
}

async function main() {
    mkdirSync(RANDBATS_DIR, { recursive: true });
    mkdirSync(SMOGON_DIR, { recursive: true });

    // --- RandBats ---
    console.log('Pulling RandBats data from pkmn/randbats...\n');
    const randbatsFiles = fetchFileList('pkmn/randbats', 'data');
    const randbatsIndex = {};

    for (const file of randbatsFiles) {
        if (file === 'index.json') continue;
        const format = file.replace('.json', '');
        console.log(`  Fetching ${file}...`);
        try {
            const data = fetchJson('pkmn/randbats', `data/${file}`);
            writeFileSync(join(RANDBATS_DIR, file), JSON.stringify(data));
            const count = Object.keys(data).length;
            console.log(`  ✓ ${file} — ${count} pokemon\n`);
            randbatsIndex[format] = count;
        } catch (e) {
            console.error(`  ✗ ${file}: ${e.message}\n`);
        }
    }
    writeFileSync(join(RANDBATS_DIR, 'index.json'), JSON.stringify(randbatsIndex));

    // --- Smogon Sets ---
    console.log('\nPulling Smogon sets from pkmn/smogon...\n');

    // Only pull the main competitive formats to keep size manageable
    const SMOGON_FORMATS = [
        'gen9ou', 'gen9uu', 'gen9ru', 'gen9nu', 'gen9pu', 'gen9ubers',
        'gen9doublesou', 'gen9monotype', 'gen9lc', 'gen9anythinggoes',
        'gen9nationaldex', 'gen9vgc2025', 'gen9vgc2024',
        'gen8ou', 'gen8uu', 'gen8ubers', 'gen8doublesou',
        'gen7ou', 'gen7uu', 'gen7ubers',
        'gen6ou', 'gen5ou', 'gen4ou', 'gen3ou', 'gen2ou', 'gen1ou',
    ];

    const smogonIndex = {};
    for (const format of SMOGON_FORMATS) {
        const file = `${format}.json`;
        console.log(`  Fetching ${file}...`);
        try {
            const data = fetchJson('pkmn/smogon', `data/sets/${file}`);
            writeFileSync(join(SMOGON_DIR, file), JSON.stringify(data));
            const count = Object.keys(data).length;
            console.log(`  ✓ ${file} — ${count} pokemon\n`);
            smogonIndex[format] = count;
        } catch (e) {
            console.error(`  ✗ ${file}: ${e.message}\n`);
        }
    }
    writeFileSync(join(SMOGON_DIR, 'index.json'), JSON.stringify(smogonIndex));

    console.log('Done!');
}

main();
