import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',

  brandTitle: 'Storybook for Rax',
  brandUrl: 'https://github.com/storybookjs/storybook/tree/master/examples/rax-kitchen-sink',
});

addons.setConfig({
  showRoots: true,
  panelPosition: 'bottom',
  theme,
});
