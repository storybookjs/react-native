import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { Location, LocationProvider } from '@storybook/router';
import { ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ManagerProvider } from './core/context';

import App from './app';

import Provider from './provider';

ThemeProvider.displayName = 'ThemeProvider';
HelmetProvider.displayName = 'HelmetProvider';

const Container = process.env.XSTORYBOOK_EXAMPLE_APP ? React.StrictMode : React.Fragment;

const Root = ({ provider }) => (
  <Container key="container">
    <HelmetProvider key="helmet.Provider">
      <LocationProvider key="location.provider">
        <Location key="location.consumer">
          {locationData => (
            <ManagerProvider key="manager" provider={provider} {...locationData}>
              {({ state }) => (
                <ThemeProvider key="theme.provider" theme={ensureTheme(state.theme)}>
                  <App key="app" viewMode={state.viewMode} layout={state.layout} />
                </ThemeProvider>
              )}
            </ManagerProvider>
          )}
        </Location>
      </LocationProvider>
    </HelmetProvider>
  </Container>
);

Root.propTypes = {
  provider: PropTypes.shape({}).isRequired,
};

function renderStorybookUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  ReactDOM.render(<Root key="root" provider={provider} />, domNode);
}

export { Provider };
export default renderStorybookUI;
