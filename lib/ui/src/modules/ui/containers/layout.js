import pick from 'lodash.pick';
import { Layout } from '@storybook/components';

import { inject } from 'mobx-react';

export default inject(stores => {
  const state = stores.store;
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
    ...uiOptions
  };
})(Layout);
