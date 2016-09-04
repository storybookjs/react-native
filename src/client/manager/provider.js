/* global location */

import UUID from 'uuid';
import qs from 'qs';
import React from 'react';
import { Provider } from '@kadira/storybook-ui';
import addons from '@kadira/storybook-addons';
import createChannel from '@kadira/storybook-channel-pagebus';
import createDatabase from '@kadira/storybook-database-local';
import Preview from './preview';

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.dataId = UUID.v4();
    this.channel = createChannel({ key: this.dataId });
    addons.setChannel(this.channel);
    this.database = addons.getDatabase();
    if (!this.database) {
      const bundled = process.env.NODE_ENV === 'production';
      if (bundled) {
        this.database = createDatabase({ url: 'addon-db.json', bundled });
      } else {
        this.database = createDatabase({ url: `${location.origin}/db` });
      }
      addons.setDatabase(this.database);
    }
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

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return (
      <Preview url={url} />
    );
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
