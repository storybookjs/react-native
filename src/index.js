import React from 'react';
import addons from '@kadira/storybook-addons';
import WrapStory from './components/WrapStory';
import KnobStore from './KnobStore';

let knobStore = null;
const knobStoreMap = {};

export function text(name, value) {
  return knob(name, { type: 'text', value });
}

export function boolean(name, value) {
  return knob(name, { type: 'boolean', value });
}

export function number(name, value) {
  return knob(name, { type: 'number', value });
}

export function object(name, value) {
  return knob(name, { type: 'object', value });
}

export function knob(name, options) {
  if (knobStore.has(name)) {
    return knobStore.get(name).value;
  }

  const knobInfo = {
    ...options,
    name
  };

  knobStore.set(name, knobInfo);
  return knobStore.get(name).value;
}

export function withKnobs(storyFn) {
  const channel = addons.getChannel();

  return (context) => {
    const key = `${context.kind}:::${context.story}`;
    knobStore = knobStoreMap[key];
    if (!knobStore) {
      knobStore = knobStoreMap[key] = new KnobStore();
    }

    const props = { context, storyFn, channel, knobStore };
    return (<WrapStory {...props} />);
  };
}
