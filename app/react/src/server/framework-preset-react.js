import { mergeBabel } from '@storybook/core/server';

export function babel(config) {
  const patch = {
    presets: [require.resolve('@babel/preset-react'), require.resolve('@babel/preset-flow')],
  };

  return mergeBabel(patch, config);
}
