import addons from '@kadira/storybook-addons';
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

export function number(name, value) {
  return manager.knob(name, { type: 'number', value });
}

export function object(name, value) {
  return manager.knob(name, { type: 'object', value });
}

export function withKnobs(storyFn, context) {
  const channel = addons.getChannel();
  return manager.wrapStory(channel, storyFn, context);
}
