import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.channel = createChannel({ page: 'manager' });
    addons.setChannel(this.channel);

    this.channel.emit(Events.CHANNEL_CREATED);
  }

  getElements(type) {
    return addons.getElements(type);
  }

  handleAPI(api) {
    this.channel.on(Events.SET_STORIES, data => {
      api.setStories(data.stories);
    });
    this.channel.on(Events.SELECT_STORY, ({ kind, story, ...rest }) => {
      api.selectStory(kind, story, rest);
    });
    this.channel.on(Events.APPLY_SHORTCUT, data => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}
