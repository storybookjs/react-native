import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import ReactModal from 'react-modal';

import App from './app';
import Provider from './provider';
import initProviderApi from './init-provider-api';
import createStore from './store';

function renderStorybokUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  const store = createStore();
  initProviderApi({ provider, store });

  const Preview = () =>
    provider.renderPreview(store.selectedKind, store.selectedStory);

  // Tell react-modal which element to mark as aria-hidden
  ReactModal.setAppElement(domNode);

  const Container = process.env.STORYBOOK_EXAMPLE_APP
    ? React.StrictMode
    : 'div';

  const root = (
    <Container>
      <MobxProvider store={store}>
        <App provider={provider} store={store} />
      </MobxProvider>
    </Container>
  );

  ReactDOM.render(root, domNode);
}

export { Provider };
export default renderStorybokUI;
