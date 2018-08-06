import React from 'react';
import { AddonPanel } from '@storybook/components';
import { Consumer } from '../../../state';

export function mapper(state, { panels }) {
  const selectedPanel = state.selectedAddonPanel;

  console.log(panels);

  return {
    panels,
    selectedPanel,
    onPanelSelect: (...args) => {
      console.log('onPanelSelect', args);
    },
  };
}

export default props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state, props),
      };

      return <AddonPanel {...finalProps} />;
    }}
  </Consumer>
);
