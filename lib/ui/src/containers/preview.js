import React from 'react';
import { Preview } from '@storybook/components';
import memoize from 'memoizerific';

import { Consumer } from '../core/context';

const createPreviewActions = memoize(1)(api => ({
  toggleFullscreen: () => api.toggleFullscreen(),
}));
const createProps = (api, layout, location, path, storyId, viewMode) => ({
  api,
  getElements: api.getElements,
  actions: createPreviewActions(api),
  options: layout,
  path,
  storyId,
  viewMode,
});

const PreviewConnected = React.memo(props => (
  <Consumer>
    {({ state, api }) => (
      <Preview
        {...props}
        {...createProps(
          api,
          state.layout,
          state.location,
          state.path,
          state.storyId,
          state.viewMode
        )}
      />
    )}
  </Consumer>
));
PreviewConnected.displayName = 'PreviewConnected';

export default PreviewConnected;
