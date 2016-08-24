import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import createChannel from '@kadira/storybook-channel-websocket';
import addons from '@kadira/storybook-addons';

export default class ReactProvider extends Provider {
  constructor({ url }) {
    super();
    this.channel = addons.getChannel();
    if (!this.channel) {
      this.channel = createChannel({ url });
      addons.setChannel(this.channel);
    }
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(selectedKind, selectedStory) {
    return null;
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.channel.emit('setCurrentStory', { kind, story });
    });
    this.channel.on('setStories', data => {
      api.setStories(data.stories);
    });
    this.channel.on('selectStory', data => {
      api.selectStory(data.kind, data.story);
    });
    this.channel.on('applyShortcut', data => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}
