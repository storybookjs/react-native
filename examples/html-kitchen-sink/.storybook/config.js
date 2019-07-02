import { load, addParameters, addDecorator } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../stories', true, /\.stories\.js$/), module);
