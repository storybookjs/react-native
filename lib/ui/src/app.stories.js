import React from 'react';
import { storiesOf } from '@storybook/react';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';

import { Root as App, Provider } from './index';

class FakeProvider extends Provider {
  constructor() {
    super();

    const channel = createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
  }

  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return <div>Hello world</div>;
  }

  handleAPI(api) {
    addons.loadAddons(api);
    api.emit(Events.GET_STORIES);
  }
}

storiesOf('UI|Layout/App', module)
  .addParameters({
    component: App,
  })
  .add('default', () => <App provider={new FakeProvider()} />);
