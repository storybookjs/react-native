import { load } from '@storybook/polymer';

// automatically import all files ending in *.stories.js
load(require.context('../src/stories', true, /\.stories\.js$/), module);
