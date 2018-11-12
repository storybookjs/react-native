import React from 'react';
import { Preview } from '@storybook/components';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>
    {({ state, api }) => {
      const customProps = {
        channel: api.getChannel(),
        getElements: api.getElements,
        actions: {
          toggleFullscreen: () => api.toggleFullscreen(),
        },
        options: {
          ...state.ui,
        },
      };
      return <Preview {...props} {...customProps} />;
    }}
  </Consumer>
);
