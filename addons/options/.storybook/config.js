import * as storybook from '@storybook/react';
import { setOptions } from '../preview';

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/storybooks/storybook',
  // goFullScreen: false,
  // showLeftPanel: true,
  showDownPanel: false,
  // showSearchBox: false,
  // downPanelInRight: false,
});

storybook.configure(() => require('./stories'), module);
