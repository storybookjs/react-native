import { configure, addParameters, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

addParameters({
  options: {
    brandTitle: 'CRA TS Kitchen Sink',
    brandUrl: 'https://github.com/storybookjs/storybook/tree/master/examples/cra-ts-kitchen-sink',
  },
});

// automatically import all files ending in *.stories.(tsx|jsx)
configure(require.context('../src', true, /\.stories\.(tsx|js)$/), module);
