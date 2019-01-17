import React from 'react';
import { storiesOf } from '@storybook/react';

import { Preview } from './preview';

const props = {
  id: 'string',
  channel: {
    on: () => {},
    emit: () => {},
    off: () => {},
  },
  storyId: 'string',
  path: 'string',
  viewMode: 'story',
  location: {},
  getElements: () => [],
  options: {
    isFullscreen: false,
    isToolshown: false,
  },
  actions: {},
};

storiesOf('Components|Preview', module).add('default', () => <Preview {...props} />);
