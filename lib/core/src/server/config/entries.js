export function createPreviewEntry(options) {
  const { configDir, presets } = options;
  const preview = [require.resolve('./polyfills'), require.resolve('./globals')];

  const configs = presets.apply('config', [], options);

  if (!configs || !configs.length) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.{ext}".`);
  }

  preview.push(...configs);

  return preview;
}

export function createManagerEntry(options) {
  const { presets } = options;
  const manager = [require.resolve('./polyfills')];

  const addons = presets.apply('addons', [], options);

  if (addons && addons.length) {
    manager.push(...addons);
  }

  manager.push(require.resolve('../../client/manager'));

  return manager;
}
