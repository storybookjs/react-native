import { configure, addParameters, addDecorator } from '@storybook/ember';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    showRoots: true,
  },
});

configure(require.context('../stories', true, /\.stories\.js$/), module);
