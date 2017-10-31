import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

// deprecated usage of infoAddon
import infoAddon from '@storybook/addon-info';

setOptions({
  name: 'CRA Kitchen Sink',
  url: 'https://github.com/storybooks/storybook/tree/master/examples/cra-kitchen-sink',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
  hierarchySeparator: /\/|\./,
});

// deprecated usage of infoAddon
setAddon(infoAddon);

// put welcome screen at the top of the list so it's the first one displayed
require('../src/stories/welcome');

// automatically import all story js files that end with *.stories.js
const req = require.context('../src/stories', true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
