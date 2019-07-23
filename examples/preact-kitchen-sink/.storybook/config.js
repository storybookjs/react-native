/** @jsx h */
import { load, addParameters, addDecorator } from '@storybook/preact';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../src', true, /\.stories\.js$/), module);
