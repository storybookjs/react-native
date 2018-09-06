import { mergeBabel } from '@storybook/core/server';

export function babel(config) {
  const patch = {
    plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
  };

  return mergeBabel(patch, config);
}
