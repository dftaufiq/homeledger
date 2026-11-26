// HomeLedger entrypoint (Node 22, standard library only).
//
// What this program does: it hands the site in. It copies the site's files
// (app/) and the screenshots of the site running (screenshots/) from beside
// this file into the output directory, then writes /output/dossier.json with
// the vendored make.fun library, which is the summary the judge reads:
// the screenshots, the first load's files and bytes, and the source.
// vendor/makefun-frontend.ts is the kit's copy, left exactly as it is — the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Run outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: two runs write the same bytes.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

mkdirSync(outputDir, { recursive: true });
rmSync(join(outputDir, 'app'), { recursive: true, force: true });
rmSync(join(outputDir, 'screenshots'), { recursive: true, force: true });
cpSync(appDir, join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit's reference/gate.json): only
// text_max_bytes shapes the bytes; the others refuse an entry the scorer
// would refuse — more than 4 screenshots, one over 256 KiB, more than 993
// files and directories in app/ or 16 MiB of app files.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
