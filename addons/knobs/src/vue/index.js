import addons from '@storybook/addons';

import {
  knob,
  text,
  boolean,
  number,
  color,
  object,
  array,
  date,
  select,
  button,
  manager,
} from '../base';

export { knob, text, boolean, number, color, object, array, date, select, button };

export const vueHandler = (channel, knobStore) => getStory => context => ({
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

  methods: {
    onKnobChange(change) {
      const { name, value } = change;
      // Update the related knob and it's value.
      const knobOptions = knobStore.get(name);

      knobOptions.value = value;
      this.story = this.getStory(this.context);
      this.$forceUpdate();
    },

    onKnobClick(clicked) {
      const knobOptions = knobStore.get(clicked.name);
      knobOptions.callback();
    },

    onKnobReset() {
      knobStore.reset();
      this.setPaneKnobs(false);
      this.story = this.getStory(this.context);
      this.$forceUpdate();
    },

    setPaneKnobs(timestamp = +new Date()) {
      channel.emit('addon:knobs:setKnobs', { knobs: knobStore.getAll(), timestamp });
    },
  },

  created() {
    channel.on('addon:knobs:reset', this.onKnobReset);
    channel.on('addon:knobs:knobChange', this.onKnobChange);
    channel.on('addon:knobs:knobClick', this.onKnobClick);
    knobStore.subscribe(this.setPaneKnobs);
  },

  beforeDestroy() {
    channel.removeListener('addon:knobs:reset', this.onKnobReset);
    channel.removeListener('addon:knobs:knobChange', this.onKnobChange);
    channel.removeListener('addon:knobs:knobClick', this.onKnobClick);
    knobStore.unsubscribe(this.setPaneKnobs);
  },
});

function wrapperKnobs(options) {
  const channel = addons.getChannel();
  manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return vueHandler(channel, manager.knobStore);
}

export function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

export function withKnobsOptions(options = {}) {
  return (storyFn, context) => wrapperKnobs(options)(storyFn)(context);
}
