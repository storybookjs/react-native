import React from 'react';
import { EventEmitter } from 'events';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import Preview from './preview';

// example stories
const stories = [
  { kind: 'Component 1', stories: ['Example State 1', 'Example State 2'] },
  { kind: 'Component 2', stories: ['Example State 1'] },
];

export default class ExampleProvider extends Provider {
  constructor() {
    super();
    this.channel = new EventEmitter();
    addons.setChannel(this.channel);
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(kind, story) {
    return <Preview />;
  }

  handleAPI(api) {
    api.setOptions({ name : 'STORY-LINKS' });
    api.setStories(stories);
    addons.loadAddons(api);
  }
}
