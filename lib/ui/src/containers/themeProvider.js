import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Consumer } from '../core/context';

export default props => (
  <Consumer>{({ state }) => <ThemeProvider {...props} theme={state.ui.theme} />}</Consumer>
);
