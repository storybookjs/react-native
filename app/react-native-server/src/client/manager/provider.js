import React from 'react';
import { Consumer } from '@storybook/api';
import { Provider } from '@storybook/ui';
import createChannel from '@storybook/channel-websocket';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import uuid from 'uuid';
import PreviewHelp from './components/PreviewHelp';

const mapper = ({ state, api }) => ({
  api,
  storiesHash: state.storiesHash,
  storyId: state.storyId,
  viewMode: state.viewMode,
});

export default class ReactProvider extends Provider {
  constructor({ url: domain, options }) {
    super();

    const { secured, host, port } = options;
    const websocketType = secured ? 'wss' : 'ws';
    let url = `${websocketType}://${domain}`;

    if (options.manualId) {
      this.pairedId = uuid();
      url += `/pairedId=${this.pairedId}`;
    }

    const channel = this.channel || createChannel({ url });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED, {
      host,
      pairedId: this.pairedId,
      port,
      secured,
    });

    this.addons = addons;
    this.channel = channel;
    this.options = options;
  }

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return (
      <Consumer filter={mapper} pure>
        {({ storiesHash, storyId, api, viewMode }) => {
          if (storiesHash[storyId]) {
            api.emit(Events.SET_CURRENT_STORY, { storyId });
          }
          return viewMode === 'story' ? <PreviewHelp /> : null;
        }}
      </Consumer>
    );
  }

  handleAPI(api) {
    addons.loadAddons(api);
    api.emit(Events.GET_STORIES);
  }
}
