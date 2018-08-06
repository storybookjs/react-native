import React from 'react';
import { window } from 'global';

import ShortcutsHelp from '../components/shortcuts_help';
import { Consumer } from '../../../state';

export const mapper = state => {
  const data = {
    isOpen: state.showShortcutsHelp,
    onClose: (...args) => {
      console.log('onClose', args);
    },
    platform: window.navigator.platform.toLowerCase(),
  };

  return data;
};

export default props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <ShortcutsHelp {...finalProps} />;
    }}
  </Consumer>
);
