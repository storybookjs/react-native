import * as storybook from '@storybook/react';
import { setOptions } from '../preview';

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/storybooks/storybook',
  // goFullScreen: false,
  // showStoriesPanel: true,
  showAddonPanel: false,
  // showSearchBox: false,
  // addonPanelInRight: false,
});

storybook.configure(() => require('./stories'), module);
