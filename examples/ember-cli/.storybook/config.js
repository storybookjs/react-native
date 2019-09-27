import { configure, addParameters, addDecorator } from '@storybook/ember';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

configure(require.context('../stories', true, /\.stories\.js$/), module);
