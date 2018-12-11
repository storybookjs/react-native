import React from 'react';
import { Preview } from '@storybook/components';
import memoize from 'memoizerific';

import { Consumer } from '../core/context';

const createPreviewActions = memoize(1)(api => ({
  toggleFullscreen: () => api.toggleFullscreen(),
}));

export default React.memo(props => (
  <Consumer>
    {({ state, api }) => {
      const customProps = {
        channel: api.getChannel(),
        getElements: api.getElements,
        actions: createPreviewActions(api),
        options: state.layout,
      };
      return <Preview {...props} {...customProps} />;
    }}
  </Consumer>
));
