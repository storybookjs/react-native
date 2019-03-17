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

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview(state, api) {
    if (state.storiesHash[state.storyId]) {
      const { kind, story } = state.storiesHash[state.storyId];

      if (!this.selection || this.selection.kind !== kind || this.selection.story !== story) {
        this.selection = { kind, story };
        api.emit(Events.SET_CURRENT_STORY, { kind, story });
        // FIXME: getPreview not implemented yet.
        if (addons.getPreview) {
          const renderPreview = addons.getPreview();
          if (renderPreview) {
            return renderPreview(kind, story);
          }
        }
      }
    }
    return <PreviewHelp />;
  }

  handleAPI(api) {
    addons.loadAddons(api);

    api.onStory((kind, story) => {
      this.selection = { kind, story };
      api.emit(Events.SET_CURRENT_STORY, this.selection);
    });
    api.on(Events.GET_CURRENT_STORY, () => {
      api.emit(Events.SET_CURRENT_STORY, this.selection);
    });
    api.emit(Events.GET_STORIES);
  }
}
