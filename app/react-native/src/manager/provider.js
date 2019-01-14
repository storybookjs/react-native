import React from 'react';
import { Provider } from '@storybook/ui';
import createChannel from '@storybook/channel-websocket';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import uuid from 'uuid';
import PreviewHelp from './components/PreviewHelp';

export default class ReactProvider extends Provider {
  constructor({ url: domain, options }) {
    super();
    this.options = options;
    this.selection = null;
    try {
      this.channel = addons.getChannel();
    } catch (err) {
      this.channel = undefined;
    }

    const { secured, host, port } = options;
    const websocketType = secured ? 'wss' : 'ws';
    let url = `${websocketType}://${domain}`;
    if (options.manualId) {
      this.pairedId = uuid();
      url += `/pairedId=${this.pairedId}`;
    }

    if (!this.channel) {
      this.channel = createChannel({ url });
      addons.setChannel(this.channel);

      this.channel.emit(Events.CHANNEL_CREATED, {
        pairedId: this.pairedId,
        secured,
        host,
        port,
      });
    }
  }

  renderPreview(kind, story) {
    this.selection = { kind, story };
    this.channel.emit(Events.SET_CURRENT_STORY, { kind, story });
    const renderPreview = addons.getPreview();

    const innerPreview = renderPreview ? renderPreview(kind, story) : null;
    return innerPreview || <PreviewHelp />;
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.selection = { kind, story };
      this.channel.emit(Events.SET_CURRENT_STORY, this.selection);
    });
    this.channel.on(Events.SELECT_STORY, ({ kind, story }) => {
      api.selectStory(kind, story);
    });
    this.channel.on(Events.SET_STORIES, data => {
      api.setStories(data.stories);
    });
    this.channel.on(Events.GET_CURRENT_STORY, () => {
      this.channel.emit(Events.SET_CURRENT_STORY, this.selection);
    });
    this.channel.emit(Events.GET_STORIES);
    addons.loadAddons(api);
  }
}
