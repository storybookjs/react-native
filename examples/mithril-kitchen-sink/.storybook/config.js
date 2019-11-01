import { configure, addParameters, addDecorator } from '@storybook/mithril';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});

configure(require.context('../src/stories', true, /\.stories\.js$/), module);
