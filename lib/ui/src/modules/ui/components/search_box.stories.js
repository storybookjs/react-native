import React from 'react';
import ReactModal from 'react-modal';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies
import { document, navigator } from 'global';

import Component from './search_box';

const stories = [
  {
    kind: 'a',
    stories: ['b', 'c'],
  },
];
const onSelectStory = action('onSelectStory');
const onClose = action('onClose');

const rootElement = document.getElementById('root');
if (rootElement != null) {
  ReactModal.setAppElement(rootElement);
}

// For some reason react-modal causes an segfault (infinite loop maybe?)
// when rendered by storyshots/react-test-renderer
if (!navigator.userAgent.match(/Node\.js/) && !navigator.userAgent.match(/jsdom/)) {
  storiesOf('UI|SearchBox', module)
    .add('default', () => (
      <Component showSearchBox onSelectStory={onSelectStory} onClose={onClose} />
    ))
    .add('with stories', () => (
      <Component showSearchBox onSelectStory={onSelectStory} onClose={onClose} stories={stories} />
    ));
}
