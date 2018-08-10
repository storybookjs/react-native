import { ThemeProvider } from 'emotion-theming';

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
