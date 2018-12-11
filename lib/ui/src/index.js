import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from '@storybook/components';
import ThemeProvider from '@emotion/provider';
import { Provider as ManagerProvider } from './core/context';

import App from './app';

import Provider from './provider';

const { Location, LocationProvider } = Router;
ThemeProvider.displayName = 'ThemeProvider';

const Container = process.env.XSTORYBOOK_EXAMPLE_APP ? React.StrictMode : React.Fragment;

const Root = ({ provider }) => (
  <Container key="container">
    <LocationProvider key="location.provider">
      <Location key="location.consumer">
        {locationData => (
          <ManagerProvider key="manager" provider={provider} {...locationData}>
            {({ state }) => (
              <ThemeProvider key="theme.provider" theme={state.ui.theme}>
                <App key="app" />
              </ThemeProvider>
            )}
          </ManagerProvider>
        )}
      </Location>
    </LocationProvider>
  </Container>
);

function renderStorybookUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  ReactDOM.render(<Root key="root" provider={provider} />, domNode);
}

export { Provider };
export default renderStorybookUI;
