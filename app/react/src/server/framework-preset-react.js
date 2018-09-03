import { mergeBabel } from '@storybook/core/server';

function extendBabel(config) {
  const patch = {
    presets: [require.resolve('@babel/preset-react'), require.resolve('@babel/preset-flow')],
  };

  return mergeBabel(patch, config);
}

export default {
  extendBabel,
};
