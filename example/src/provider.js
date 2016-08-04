import React from 'react';
import { EventEmitter } from 'events';
import Preview from './preview';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';

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
    const ps = addons.getPanels();
    return ps;
  }

  renderPreview(kind, story) {
    return <Preview />;
  }

  handleAPI(api) {
    api.setOptions({ name : 'KNOBS' });
    api.setStories(stories);
    addons.loadAddons(api);
  }
}
