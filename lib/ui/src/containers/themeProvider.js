import React from 'react';
import ThemeProvider from '@emotion/provider';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>{({ state }) => <ThemeProvider {...props} theme={state.uiOptions.theme} />}</Consumer>
);
