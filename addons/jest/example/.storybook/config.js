import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
// --> import { setupJestAddon } from 'storybook-addon-jest';


setOptions({
  name: 'JEST ADDON',
  url: 'https://github.com/renaudtertrais/storybook-addon-jest',
  downPanelInRight: true,
  showLeftPanel: true,
});

function loadStories() {
  require('../List.story');
}

configure(loadStories, module);
