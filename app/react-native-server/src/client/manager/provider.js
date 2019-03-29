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
    this.selection = null;
  }

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return (
      <Consumer filter={mapper}>
        {({ storiesHash, storyId, api }) => {
          if (storiesHash[storyId]) {
            const { kind, story } = storiesHash[storyId];

            if (!this.selection || this.selection.kind !== kind || this.selection.story !== story) {
              this.selection = { kind, story };
              // TODO: isn't this event sent twice now?
              api.emit(Events.SET_CURRENT_STORY, { kind, story });
            }

            // FIXME: getPreview not implemented yet.
            if (addons.getPreview) {
              const renderPreview = addons.getPreview();
              if (renderPreview) {
                return renderPreview(kind, story);
              }
            }
          }
          return <PreviewHelp />;
        }}
      </Consumer>
    );
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
