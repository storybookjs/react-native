import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from '@storybook/components';

import App from './app';
import ThemeProvider from './containers/themeProvider';
import Provider from './provider';

import { Provider as ManagerProvider } from './core/context';

const { Location, LocationProvider } = Router;

function renderStorybookUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const Container = process.env.STORYBOOK_EXAMPLE_APP ? React.StrictMode : React.Fragment;
  const root = (
    <Container>
      <LocationProvider>
        <Location>
          {locationData => (
            <ManagerProvider provider={provider} {...locationData}>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </ManagerProvider>
          )}
        </Location>
      </LocationProvider>
    </Container>
  );

  ReactDOM.render(root, domNode);
}

export { Provider };
export default renderStorybookUI;
