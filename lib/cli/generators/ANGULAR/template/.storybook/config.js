import { load } from '@storybook/angular';

// automatically import all files ending in *.stories.ts
load(require.context('../src/stories', true, /\.stories\.ts$/), module);
