import { document } from 'global';
import React from 'react';
import keycode from 'keycode';
import { EventEmitter } from 'events';
import parseKeyEvent from '../../src/libs/key_events';
import { Provider } from '../../src';
import Preview from './preview';

const style = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.globalState = new EventEmitter();
  }

  getPanels() {
    const panels = {
      test1: {
        title: 'Test 1',
        render: () => {
          let inp;
          return (
            <div style={style}>
              <input
                ref={i => {
                  inp = i;
                }}
                value={
                  this.api.getQueryParam('text') === undefined ? (
                    'ONE'
                  ) : (
                    this.api.getQueryParam('text')
                  )
                }
                onChange={() => {
                  this.api.setQueryParams({ text: inp.value });
                }}
              />
            </div>
          );
        },
      },
      test2: {
        title: 'Test 2',
        render: () => <div style={style}>II</div>,
      },
      test3: {
        title: 'Test 3',
        render: () => <div style={style}>III</div>,
      },
      test4: {
        title: 'Test 4',
        render: () => <div style={style}>IV</div>,
      },
    };
    return panels;
  }

  // You must implement this public API.
  renderPreview(selectedKind, selectedStory) {
    // We need to do this here to avoid memory leaks in the globalState.
    // That's because renderPreview can be called multiple times.
    this.handlePreviewEvents();

    // create preview React component.
    const preview = new Preview(this.globalState);
    this.globalState.emit('change', selectedKind, selectedStory);
    return preview;
  }

  // You must implement this public API.
  handleAPI(api) {
    this.api = api;
    this.api.setOptions({
      name: 'REACT-STORYBOOK',
      sortStoriesByKind: true,
    });

    // set stories
    this.api.setStories(this.createStories());

    // listen to the story change and update the preview.
    this.api.onStory((kind, story) => {
      this.globalState.emit('change', kind, story);
    });
  }

  createStories() {
    return [
      {
        kind: 'some/name/Component 1',
        stories: ['State 1', 'State 2'],
      },
      {
        kind: 'some/name/Component 2',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'some/name2/Component 3',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'some/name2',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'some/name2/Component 4',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'another/name3/Component 5',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'another/name3/Component 6',
        stories: ['State a', 'State b'],
      },
      {
        kind: 'Bla 1',
        stories: ['State 1', 'State 2'],
      },
      {
        kind: 'Bla 2',
        stories: ['State 1', 'State 2'],
      },
      {
        kind: 'anotherComponent in the middle',
        stories: ['State a', 'State b'],
      },
    ];
  }

  handlePreviewEvents() {
    this.globalState.removeAllListeners();

    // jumping to an story.
    this.globalState.on('jump', (kind, story) => {
      this.api.selectStory(kind, story);
    });

    // calling a shortcut functionality.
    this.globalState.on('toggleFullscreen', () => {
      const target = document.createElement('div');
      const event = {
        target,
        ctrlKey: true,
        shiftKey: true,
        keyCode: keycode('F'),
        preventDefault() {},
      };
      const parsedEvent = parseKeyEvent(event);
      this.api.handleShortcut(parsedEvent);
    });
  }
}
