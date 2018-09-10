import { mergeBabel } from '@storybook/core/server';

export function babelDefault(config) {
  const patch = {
    plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
  };

  return mergeBabel(patch, config);
}
