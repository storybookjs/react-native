import React from 'react';
import pick from 'lodash.pick';
import { Layout } from '@storybook/components';
import { Consumer } from '../../../state';

export const mapper = state => {
  const { shortcutOptions, isMobileDevice, uiOptions } = state;
  const currentOptions = pick(
    shortcutOptions,
    'showStoriesPanel',
    'showAddonPanel',
    'goFullScreen',
    'addonPanelInRight'
  );

  return {
    ...currentOptions,
    isMobileDevice,
    ...uiOptions,
  };
};

export default props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <Layout {...finalProps} />;
    }}
  </Consumer>
);
