import { configure, addParameters, addDecorator } from '@storybook/riot';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    showRoots: true,
  },
});

configure(require.context('../src/stories', true, /\.stories\.js$/), module);
