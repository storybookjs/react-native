/* eslint-disable react/no-this-in-sfc, no-underscore-dangle */

import React from 'react';
import { NativeModules } from 'react-native';
import parse from 'url-parse';
import addons from '@storybook/addons';

import Events from '@storybook/core-events';
import createChannel from '@storybook/channel-websocket';
import { EventEmitter } from 'events';
import { StoryStore, ClientApi } from '@storybook/core/client';
import OnDeviceUI from './components/OnDeviceUI';
import StoryView from './components/StoryView';

export default class Preview {
  constructor() {
    this._addons = {};
    this._decorators = [];
    this._stories = new StoryStore();
    this._clientApi = new ClientApi({ storyStore: this._stories });

    [
      'storiesOf',
      'setAddon',
      'addDecorator',
      'addParameters',
      'clearDecorators',
      'getStorybook',
    ].forEach(method => {
      this[method] = this._clientApi[method].bind(this._clientApi);
    });
  }

  configure(loadStories, module) {
    loadStories();
    if (module && module.hot) {
      module.hot.accept(() => this._sendSetStories());
      // TODO remove all global decorators on dispose
    }
  }

  getStorybookUI(params = {}) {
    return () => {
      let webUrl = null;
      let channel = null;

      try {
        channel = addons.getChannel();
      } catch (e) {
        // getChannel throws if the channel is not defined,
        // which is fine in this case (we will define it below)
      }

      if (!channel || params.resetStorybook) {
        if (params.onDeviceUI && params.disableWebsockets) {
          channel = new EventEmitter();
        } else {
          const host = params.host || parse(NativeModules.SourceCode.scriptURL).hostname;
          const port = params.port !== false ? `:${params.port || 7007}` : '';

          const query = params.query || '';
          const { secured } = params;
          const websocketType = secured ? 'wss' : 'ws';
          const httpType = secured ? 'https' : 'http';

          const url = `${websocketType}://${host}${port}/${query}`;
          webUrl = `${httpType}://${host}${port}`;
          channel = createChannel({ url });
        }

        addons.setChannel(channel);

        channel.emit(Events.CHANNEL_CREATED);
      }

      channel.on(Events.GET_STORIES, () => this._sendSetStories());
      channel.on(Events.SET_CURRENT_STORY, d => this._selectStory(d));
      this._sendSetStories();
      this._sendGetCurrentStory();

      // finally return the preview component
      return params.onDeviceUI ? (
        <OnDeviceUI stories={this._stories} events={channel} url={webUrl} />
      ) : (
        <StoryView url={webUrl} events={channel} />
      );
    };
  }

  _sendSetStories() {
    const channel = addons.getChannel();
    const stories = this._stories.dumpStoryBook();
    channel.emit(Events.SET_STORIES, { stories });
  }

  _sendGetCurrentStory() {
    const channel = addons.getChannel();
    channel.emit(Events.GET_CURRENT_STORY);
  }

  _selectStory(selection) {
    const { kind, story } = selection;
    const storyFn = this._stories.getStoryWithContext(kind, story);
    const channel = addons.getChannel();
    channel.emit(Events.SELECT_STORY, selection, storyFn);
  }
}
