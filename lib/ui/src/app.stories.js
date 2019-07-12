import React from 'react';
import { storiesOf } from '@storybook/react';
import addons from '@storybook/addons';

import { Root as App, Provider } from './index';

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
}

storiesOf('UI|Layout/App', module)
  .addParameters({
    component: App,
  })
  .add('default', () => <App provider={new FakeProvider()} />);
