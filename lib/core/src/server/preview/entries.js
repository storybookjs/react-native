export async function createPreviewEntry(options) {
  const { configDir, presets } = options;
  const entries = [require.resolve('../common/polyfills'), require.resolve('./globals')];

  const configs = await presets.apply('config', [], options);

  if (!configs || !configs.length) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.{ext}".`);
  }

  entries.push(...configs);

  return entries;
}
