import addons from '@storybook/addons';

const vueHandler = (channel, backgrounds) => (getStory, context) => ({
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
    channel.emit('background-set', backgrounds);
  },

  beforeDestroy() {
    channel.emit('background-unset');
  },
});

export default function makeDecorator(backgrounds) {
  const channel = addons.getChannel();
  return vueHandler(channel, backgrounds);
}
