import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';

export default class ReactProvider extends Provider {
  constructor() {
    super();

    const channel = createChannel({ page: 'manager' });

    addons.setChannel(channel);
    channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons;
    this.channel = channel;
  }

  getElements(type) {
    return this.addons.getElements(type);
  }

  handleAPI(api) {
    this.addons.loadAddons(api);
  }
}
