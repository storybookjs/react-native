import * as commonPreset from './frameworks/common/preset';

// Map a framework to a preset file that gets executed
type Preset = any;
type FrameworkPresetMapper = (framework: string) => string | void;

const PRESET_METHODS = [
  'babel',
  'babelDefault',
  'managerBabel',
  'webpack',
  'webpackFinal',
  'managerWebpack',
  'addons',
  'entries',
  'config',
];

function getFrameworkPreset(frameworkPresetFile: string): Preset {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(frameworkPresetFile);
}

// Create a composite preset that applies the base preset &
// appends any framework-specific extensions as needed
function withFrameworkExtensions(basePreset: Preset, mapper: FrameworkPresetMapper): Preset {
  const extended: Preset = {};
  PRESET_METHODS.forEach(method => {
    extended[method] = (existing: any, options: any) => {
      let updated = existing;

      const baseMethod = basePreset[method];
      if (baseMethod) {
        updated = baseMethod(updated, options);
      }

      const frameworkPresetFile = mapper(options.framework);
      if (frameworkPresetFile) {
        const frameworkPreset = getFrameworkPreset(frameworkPresetFile);
        const frameworkMethod = frameworkPreset[method];
        if (frameworkMethod) updated = frameworkMethod(updated, options);
      }

      return updated;
    };
  });
  return extended;
}

module.exports = withFrameworkExtensions(commonPreset, framework => {
  try {
    return require.resolve(`./frameworks/${framework}/preset`) as string;
  } catch (err) {
    // there is no custom config for the user's framework, do nothing
    return null;
  }
});
