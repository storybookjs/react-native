import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';

addDecorator(
  withOptions({
    name: 'CRA TypeScript Kitchen Sink',
    url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-ts-kitchen-sink',
  })
);
addDecorator(withInfo());

function loadStories() {
  // automatically import all story js files that end with *.stories.tsx
  const req = require.context('../src', true, /\.stories\.tsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
