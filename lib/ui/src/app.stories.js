import React from 'react';
import { styled } from '@storybook/theming';
import { storiesOf } from '@storybook/react';
import addons from '@storybook/addons';

import { Root as App, Provider } from './index';

const CustomApp = styled.div({
  '#preview-loader': {
    display: 'none',
  },
});

class FakeProvider extends Provider {
  constructor() {
    super();

    this.addons = addons;
    this.channel = {
      on: () => {},
      off: () => {},
      emit: () => {},
      addPeerListener: () => {},
    };
  }

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return <div>Hello world</div>;
  }

  handleAPI(api) {
    addons.loadAddons(api);
  }

  getConfig() {
    return {};
  }
}

class FakeLoadingProvider extends FakeProvider {
  renderPreview() {
    return <p>Switch between Desktop and Mobile viewport to see how the loading state behaves.</p>;
  }
}

storiesOf('UI/Layout/App', module)
  .addParameters({
    component: App,
  })
  .add('default', () => (
    <CustomApp>
      <App provider={new FakeProvider()} />
    </CustomApp>
  ))
  .add('loading state', () => <App provider={new FakeLoadingProvider()} />);
