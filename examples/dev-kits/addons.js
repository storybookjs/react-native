import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
});
