import { load } from '@storybook/svelte';

// automatically import all files ending in *.stories.js
load(require.context('../stories', true, /\.stories\.js$/), module);
