import { configure } from '@storybook/rax';

// automatically import all story js files that end with *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
