import { configure, addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    brandTitle: 'CRA TypeScript Kitchen Sink',
    brandUrl: 'https://github.com/storybooks/storybook/tree/master/examples/cra-ts-kitchen-sink',
  },
});
addDecorator(withInfo());

function loadStories() {
  // automatically import all story js files that end with *.stories.tsx
  const req = require.context('../src', true, /\.stories\.tsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
