import loadPresets from '../presets';
import loadCustomPresets from '../common/custom-presets';

async function getManagerWebpackConfig(options, presets) {
  const entries = await presets.apply('managerEntries', [], options);

  return presets.apply('managerWebpack', {}, { ...options, entries });
}

export default async options => {
  const { corePresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('../common/babel-cache-preset.js'),
    ...loadCustomPresets(options),
    ...overridePresets,
  ];

  const presets = loadPresets(presetsConfig);

  return getManagerWebpackConfig({ ...restOptions, presets }, presets);
};
