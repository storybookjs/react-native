import addons from '@storybook/addons';

import { knob, text, boolean, number, color, object, array, date, select, manager } from '../base';

export { knob, text, boolean, number, color, object, array, date, select };

export const vueHandler = (channel, knobStore) => getStory => context => ({
  render(h) {
    return h(getStory(context));
  },

  methods: {
    onKnobChange(change) {
      const { name, value } = change;
      // Update the related knob and it's value.
      const knobOptions = knobStore.get(name);
      knobOptions.value = value;
      this.$forceUpdate();
    },

    onKnobReset() {
      knobStore.reset();
      this.setPaneKnobs(false);
      this.$forceUpdate();
    },

    setPaneKnobs(timestamp = +new Date()) {
      channel.emit('addon:knobs:setKnobs', { knobs: knobStore.getAll(), timestamp });
    },
  },

  created() {
    channel.on('addon:knobs:reset', this.onKnobReset);
    channel.on('addon:knobs:knobChange', this.onKnobChange);
    knobStore.subscribe(this.setPaneKnobs);
  },

  beforeDestroy() {
    channel.removeListener('addon:knobs:reset', this.onKnobReset);
    channel.removeListener('addon:knobs:knobChange', this.onKnobChange);
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
