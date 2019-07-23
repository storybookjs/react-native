import { load } from '@storybook/ember';

// automatically import all files ending in *.stories.js
load(require.context('../stories', true, /\.stories\.js$/), module);
