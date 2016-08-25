import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import createChannel from '@kadira/storybook-channel-websocket';
import addons from '@kadira/storybook-addons';

export default class ReactProvider extends Provider {
  constructor({ url }) {
    super();
    this.selection = null;
    this.channel = addons.getChannel();
    if (!this.channel) {
      this.channel = createChannel({ url });
      addons.setChannel(this.channel);
    }
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(kind, story) {
    this.selection = { kind, story };
    this.channel.emit('setCurrentStory', { kind, story });
    return null;
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.selection = { kind, story };
      this.channel.emit('setCurrentStory', this.selection);
    });
    this.channel.on('setStories', data => {
      api.setStories(data.stories);
    });
    this.channel.on('getCurrentStory', () => {
      this.channel.emit('setCurrentStory', this.selection);
    });
    this.channel.emit('getStories');
    addons.loadAddons(api);
  }
}
