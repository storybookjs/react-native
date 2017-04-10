import * as storybook from '@kadira/storybook';
import { setOptions } from '../preview';

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/kadirahq/storybook-addon-options',
  // goFullScreen: false,
  // showLeftPanel: true,
  showDownPanel: false,
  // showSearchBox: false,
  // downPanelInRight: false,
});

storybook.configure(() => require('./stories'), module);
