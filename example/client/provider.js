import React from 'react';
import Preview from './preview';
import keycode from 'keycode';
import { EventEmitter } from 'events';
import parseKeyEvent from '../../src/libs/key_events';

let id = 0;

export default class ReactProvider {
  constructor() {
    this.globalState = new EventEmitter();
  }

  renderPreview(selectedKind, selectedStory) {
    this.globalState.removeAllListeners();
    this.globalState.on('action', (message) => {
      this.api.addAction({
        data: { message },
        id: ++id,
      });
    });

    this.globalState.on('jump', (kind, story) => {
      this.api.selectStory(kind, story);
    });

    this.globalState.on('toggleFullscreen', () => {
      const event = {
        ctrlKey: true,
        shiftKey: true,
        keyCode: keycode('F'),
        preventDefault() {},
      };
      const parsedEvent = parseKeyEvent(event);
      console.log(parsedEvent);
      this.api.handleShortcut(parsedEvent);
    });

    const preview = new Preview(this.globalState);
    this.globalState.emit('change', selectedKind, selectedStory);

    return preview;
  }

  handleAPI(api) {
    this.api = api;
    this.api.setStories([
      {
        kind: 'Component 1',
        stories: ['State 1', 'State 2']
      },

      {
        kind: 'Component 2',
        stories: ['State a', 'State b']
      }
    ]);

    this.api.onStory((kind, story) => {
      this.globalState.emit('change', kind, story);
    });
  }
}
