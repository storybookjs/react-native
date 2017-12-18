import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SearchBox from './search_box';

const stories = [
  {
    kind: 'a',
    stories: ['b', 'c'],
  },
];
const onSelectStory = action('onSelectStory');
const onClose = action('onClose');
storiesOf('ui/SearchBox', module)
  .add('default', () => <SearchBox showSearchBox onSelectStory={onSelectStory} onClose={onClose} />)
  .add('with stories', () => (
    <SearchBox showSearchBox onSelectStory={onSelectStory} onClose={onClose} stories={stories} />
  ));
