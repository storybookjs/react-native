import React from 'react';
import { storiesOf } from '@storybook/react';
import { types } from '@storybook/addons';

import { Preview } from './preview';

export const previewProps = {
  id: 'string',
  api: {
    on: () => {},
    emit: () => {},
    off: () => {},
  },
  storyId: 'string',
  path: 'string',
  viewMode: 'story',
  location: {},
  baseUrl: 'http://example.com',
  getElements: type =>
    type === types.TAB
      ? [
          {
            id: 'notes',
            type: types.TAB,
            title: 'Notes',
            route: ({ storyId }) => `/info/${storyId}`, // todo add type
            match: ({ viewMode }) => viewMode === 'info', // todo add type
            render: () => null,
          },
        ]
      : [],
  options: {
    isFullscreen: false,
    isToolshown: true,
  },
  actions: {},
};

storiesOf('UI|Preview/Preview', module)
  .add('no tabs', () => <Preview {...previewProps} getElements={() => []} />)
  .add('with tabs', () => <Preview {...previewProps} />);
