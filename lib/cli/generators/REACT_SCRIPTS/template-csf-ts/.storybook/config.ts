import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.(tsx|jsx)
configure(require.context('../src/stories', true, /\.stories\.[tj]sx?$/), module);
