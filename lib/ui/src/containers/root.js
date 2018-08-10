import pick from 'lodash.pick';
import { Root } from '@storybook/components';

import { inject } from 'mobx-react';

export default inject(stores => {
  const state = stores.store;
  const { shortcutOptions, uiOptions } = state;
  const currentOptions = pick(shortcutOptions, 'panel', 'full', 'nav');

  return {
    options: {
      ...currentOptions,
      ...uiOptions,
    },
  };
})(Root);
