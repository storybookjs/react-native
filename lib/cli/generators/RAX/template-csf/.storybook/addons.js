import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';

import { create } from '@storybook/theming/create';
import { addons } from '@storybook/addons';

const theme = create({
  base: 'light',

  brandTitle: 'Rax Kitchen Sink',
  brandUrl: 'https://github.com/storybookjs/storybook/tree/master/examples/rax-kitchen-sink',
});

addons.setConfig({ theme });
