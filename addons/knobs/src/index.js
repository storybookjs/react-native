// import { window } from 'global';
import addons from '@storybook/addons';
import KnobManager from './KnobManager';

const manager = new KnobManager();

export function knob(name, options) {
  return manager.knob(name, options);
}

export function text(name, value) {
  return manager.knob(name, { type: 'text', value });
}

export function boolean(name, value) {
  return manager.knob(name, { type: 'boolean', value });
}

export function number(name, value, options = {}) {
  const defaults = {
    range: false,
    min: 0,
    max: 10,
    step: 1,
  };

  const mergedOptions = { ...defaults, ...options };

  const finalOptions = {
    ...mergedOptions,
    type: 'number',
    value,
  };

  return manager.knob(name, finalOptions);
}

export function color(name, value) {
  return manager.knob(name, { type: 'color', value });
}

export function object(name, value) {
  return manager.knob(name, { type: 'object', value });
}

export function select(name, options, value) {
  return manager.knob(name, { type: 'select', options, value });
}

export function array(name, value, separator = ',') {
  return manager.knob(name, { type: 'array', value, separator });
}

export function date(name, value = new Date()) {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue });
}

// export function withKnobs(storyFn, context) {
//   const channel = addons.getChannel();
//   return manager.wrapStory(channel, storyFn, context);

// export function withKnobsOptions(options = {}) {
//   return (...args) => {
//     const channel = addons.getChannel();
//     channel.emit('addon:knobs:setOptions', options);

//     return withKnobs(...args);
//   };
// }

export function withKnobs() {
  const channel = addons.getChannel();
  manager.initStore(channel);

  return storyFn => context => ({
    render(h) {
      const story = storyFn(context);
      return h(typeof story === 'string' ? { template: story } : story);
    },
    created() {
      channel.on('addon:knobs:knobChange', change => {
        const { name, value } = change;
        // Update the related knob and it's value.
        const knobOptions = manager.knobStore.get(name);
        knobOptions.value = value;
        this.$forceUpdate();
      });
    },
  });
}
