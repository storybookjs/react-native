import React from 'react';
import { Preview } from '@storybook/components';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>
    {({ state, manager }) => {
      const customProps = {
        channel: manager.getChannel(),
        getElements: manager.getElements,
        actions: {
          toggleFullscreen: () => manager.toggleFullscreen(),
        },
        options: {
          ...state.ui,
        },
      };
      return <Preview {...props} {...customProps} />;
    }}
  </Consumer>
);
