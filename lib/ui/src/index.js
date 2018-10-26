import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { window } from 'global';

import { createHistory, LocationProvider } from '@reach/router';
import App from './app';
import ThemeProvider from './containers/themeProvider';
import Provider from './provider';

import initProviderApi from './init-provider-api';
import handleHistoryLoad from './onload-history';
import initKeyHandler from './init-key-handler';

import createManager from './core/manager';
import { Provider as ManagerProvider } from './core/context';

function renderStorybookUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  // init history
  const history = createHistory(window);

  const manager = createManager({ history, provider });

  // Init event handle to stores
  const eventHandler = initKeyHandler({ manager });

  // listen to events
  eventHandler.bind();

  /** Init external interaction with the state */
  initProviderApi({ provider, manager, eventHandler });

  /** parse old url params to set state and redirect to new routing scheme */
  handleHistoryLoad(history, manager);

  // const Preview = () => provider.renderPreview(store.selectedKind, store.selectedStory);

  // Tell react-modal which element to mark as aria-hidden
  ReactModal.setAppElement(domNode);

  const Container = process.env.STORYBOOK_EXAMPLE_APP ? React.StrictMode : 'div';
  const root = (
    <Container>
      <ManagerProvider manager={manager}>
        <ThemeProvider>
          <LocationProvider history={history}>
            <App />
          </LocationProvider>
        </ThemeProvider>
      </ManagerProvider>
    </Container>
  );

  ReactDOM.render(root, domNode);
}

export { Provider };
export default renderStorybookUI;
