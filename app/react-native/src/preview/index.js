/* eslint no-underscore-dangle: 0 */

import React from 'react';
import { NativeModules } from 'react-native';
import parse from 'url-parse';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-websocket';
import { EventEmitter } from 'events';
import StoryStore from './story_store';
import StoryKindApi from './story_kind';
import OnDeviceUI from './components/OnDeviceUI';
import StoryView from './components/StoryView';

export default class Preview {
  constructor() {
    this._addons = {};
    this._decorators = [];
    this._stories = new StoryStore();
    this._events = new EventEmitter();
  }

  storiesOf(kind, module) {
    if (module && module.hot) {
      // TODO remove the kind on dispose
    }
    return new StoryKindApi(this._stories, this._addons, this._decorators, kind);
  }

  setAddon(addon) {
    Object.assign(this._addons, addon);
  }

  addDecorator(decorator) {
    this._decorators.push(decorator);
  }

  configure(loadStories, module) {
    loadStories();
    if (module && module.hot) {
      module.hot.accept(() => this._sendSetStories());
      // TODO remove all global decorators on dispose
    }
  }

  getStorybook() {
    return this._stories.getStoryKinds().map(kind => {
      const stories = this._stories.getStories(kind).map(name => {
        const render = this._stories.getStory(kind, name);
        return { name, render };
      });
      return { kind, stories };
    });
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

      if (params.resetStorybook || !channel) {
        const host = params.host || parse(NativeModules.SourceCode.scriptURL).hostname;
        const port = params.port !== false ? `:${params.port || 7007}` : '';

        const query = params.query || '';
        const secured = params.secured;
        const websocketType = secured ? 'wss' : 'ws';
        const httpType = secured ? 'https' : 'http';

        const url = `${websocketType}://${host}${port}/${query}`;
        webUrl = `${httpType}://${host}${port}`;
        channel = createChannel({ url });
        addons.setChannel(channel);
      }
      channel.on('getStories', () => this._sendSetStories());
      channel.on('setCurrentStory', d => this._selectStory(d));
      this._events.on('setCurrentStory', d => this._selectStory(d));
      this._sendSetStories();
      this._sendGetCurrentStory();

      // finally return the preview component
      return params.onDeviceUI
        ? <OnDeviceUI stories={this._stories} events={this._events} url={webUrl} />
        : <StoryView url={webUrl} events={this._events} />;
    };
  }

  _sendSetStories() {
    const channel = addons.getChannel();
    const stories = this._stories.dumpStoryBook();
    channel.emit('setStories', { stories });
  }

  _sendGetCurrentStory() {
    const channel = addons.getChannel();
    channel.emit('getCurrentStory');
  }

  _selectStory(selection) {
    const { kind, story } = selection;
    const storyFn = this._stories.getStory(kind, story);
    this._events.emit('story', storyFn, selection);
  }
}
