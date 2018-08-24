
import ThemeProvider from '@emotion/provider';

import { inject } from 'mobx-react';

export default inject(stores => {
  const state = stores.store;
  const {
    uiOptions: { theme },
  } = state;

  return {
    theme,
  };
})(ThemeProvider);
