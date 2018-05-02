import addons from '@storybook/addons';

import Events from './events';

export const vueHandler = (channel, backgrounds) => (getStory, context) => ({
  data() {
    return {
      context,
      getStory,
      story: getStory(context),
    };
  },

  render(h) {
    return h(this.story);
  },

  created() {
    channel.emit(Events.SET, backgrounds);
  },

  beforeDestroy() {
    channel.emit(Events.UNSET);
  },
});

export default function makeDecorator(backgrounds) {
  const channel = addons.getChannel();
  return vueHandler(channel, backgrounds);
}
