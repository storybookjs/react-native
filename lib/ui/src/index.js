import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import ReactModal from 'react-modal';
import { Router } from '@storybook/components';

import App from './app';
import ThemeProvider from './containers/themeProvider';
import Provider from './provider';

import initProviderApi from './init-provider-api';
// import initHistoryHandler from './init-history-handler';
import initKeyHandler from './init-key-handler';
import createStore from './store';

// const history = createBrowserHistory();

function renderStorybookUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const store = createStore({ provider });

  /** Init external interaction with the state */
  initProviderApi({ provider, store });
  // initHistoryHandler({ history, store });
  initKeyHandler({ store });

  // const Preview = () => provider.renderPreview(store.selectedKind, store.selectedStory);

  // Tell react-modal which element to mark as aria-hidden
  ReactModal.setAppElement(domNode);

  const Container = process.env.STORYBOOK_EXAMPLE_APP ? React.StrictMode : 'div';

  const root = (
    <Container>
      <MobxProvider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MobxProvider>
    </Container>
  );

  ReactDOM.render(root, domNode);
}

export { Provider };
export default renderStorybookUI;
