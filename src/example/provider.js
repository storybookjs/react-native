import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import Preview from './preview';

// example stories
const stories = [
  { kind: 'Component 1', stories: ['Example State 1', 'Example State 2'] },
  { kind: 'Component 2', stories: ['Example State 1'] },
];

export default class ExampleProvider extends Provider {
  constructor(channel) {
    super(channel);
    addons.setChannel(channel);
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(kind, story) {
    return <Preview />;
  }

  handleAPI(api) {
    api.setOptions({ name : 'ACTION-LOGGER' });
    api.setStories(stories);
    addons.loadAddons(api);
  }
}
