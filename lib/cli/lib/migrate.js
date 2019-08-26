import { listCodemods, runCodemod } from '@storybook/codemod';

export async function migrate(migration, { configDir, glob, dryRun, list, rename, logger }) {
  if (list) {
    listCodemods().forEach(key => logger.log(key));
  } else if (migration) {
    await runCodemod(migration, { configDir, glob, dryRun, logger, rename });
  } else {
    throw new Error('Migrate: please specify a migration name or --list');
  }
}
