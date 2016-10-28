/* global location */
/* eslint class-methods-use-this: 0 */

import UUID from 'uuid';
import qs from 'qs';
import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import createChannel from '@kadira/storybook-channel-postmsg';
import Preview from './preview';

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.dataId = UUID.v4();
    this.channel = createChannel({ key: this.dataId });
    addons.setChannel(this.channel);
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(selectedKind, selectedStory) {
    const queryParams = {
      dataId: this.dataId,
      selectedKind,
      selectedStory,
    };

    const DefaultPreviewDecorator = ({ children }) => children;
    const PreviewDecorator = addons.getPreviewDecorator() || DefaultPreviewDecorator;

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return (
      <PreviewDecorator>
        <Preview url={url} />
      </PreviewDecorator>
    );
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.channel.emit('setCurrentStory', { kind, story });
    });
    this.channel.on('setStories', (data) => {
      api.setStories(data.stories);
    });
    this.channel.on('selectStory', (data) => {
      api.selectStory(data.kind, data.story);
    });
    this.channel.on('applyShortcut', (data) => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}
