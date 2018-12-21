import loadPresets from './presets';
import loadCustomPresets from './common/custom-presets';

async function getPreviewWebpackConfig(options, presets) {
  const babelOptions = await presets.apply('babel', {}, options);
  const entries = await presets.apply('entries', [], options);

  return presets.apply('webpack', {}, { ...options, babelOptions, entries });
}

export default async options => {
  const { corePresets = [], frameworkPresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./common/babel-cache-preset.js'),
    ...frameworkPresets,
    ...loadCustomPresets(options),
    ...overridePresets,
  ];

  const presets = loadPresets(presetsConfig);

  return getPreviewWebpackConfig({ ...restOptions, presets }, presets);
};
