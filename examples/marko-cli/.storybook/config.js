import { load, addParameters, addDecorator } from '@storybook/marko';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

load(require.context('../src/stories', true, /\.stories\.js$/), module);
