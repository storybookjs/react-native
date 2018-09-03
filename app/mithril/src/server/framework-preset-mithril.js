import { mergeBabel } from '@storybook/core/server';

function extendBabel(config) {
  const patch = {
    plugins: [require.resolve('@babel/plugin-transform-react-jsx')],
  };

  return mergeBabel(patch, config);
}

export default {
  extendBabel,
};
