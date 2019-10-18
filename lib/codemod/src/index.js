/* eslint import/prefer-default-export: "off" */
import fs from 'fs';
import { promisify } from 'util';
import globby from 'globby';
import { sync as spawnSync } from 'cross-spawn';

export {
  default as updateOrganisationName,
  packageNames,
} from './transforms/update-organisation-name';

export { default as updateAddonInfo } from './transforms/update-addon-info';

const TRANSFORM_DIR = `${__dirname}/transforms`;

export function listCodemods() {
  return fs
    .readdirSync(TRANSFORM_DIR)
    .filter(fname => fname.endsWith('.js'))
    .map(fname => fname.slice(0, -3));
}

const renameAsync = promisify(fs.rename);

async function renameFile(file, from, to, { logger }) {
  const newFile = file.replace(from, to);
  logger.log(`Rename: ${file} ${newFile}`);
  return renameAsync(file, newFile);
}

export async function runCodemod(codemod, { glob, logger, dryRun, rename, parser }) {
  const codemods = listCodemods();
  if (!codemods.includes(codemod)) {
    throw new Error(`Unknown codemod ${codemod}. Run --list for options.`);
  }

  let renameParts = null;
  if (rename) {
    renameParts = rename.split(':');
    if (renameParts.length !== 2) {
      throw new Error(`Codemod rename: expected format "from:to", got "${rename}"`);
    }
  }

  const files = await globby([glob, '!node_modules', '!dist']);
  logger.log(`=> Applying ${codemod}: ${files.length} files`);
  if (!dryRun) {
    const parserArgs = parser ? ['--parser', parser] : [];
    spawnSync(
      'npx',
      ['jscodeshift', '-t', `${TRANSFORM_DIR}/${codemod}.js`, ...parserArgs, ...files],
      {
        stdio: 'inherit',
      }
    );
  }

  if (renameParts) {
    const [from, to] = renameParts;
    logger.log(`=> Renaming ${rename}: ${files.length} files`);
    await Promise.all(files.map(file => renameFile(file, new RegExp(`${from}$`), to, { logger })));
  }
}
