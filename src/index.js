import React from 'react';
import addons from '@kadira/storybook-addons';
import Wrap from './components/Wrap';

let knobStore = {};
const stories = {};

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
  if (knobStore[name]) {
    return knobStore[name].value;
  }

  const knobInfo = {
    ...options,
    name
  };

  knobStore[name] = knobInfo;
  return knobInfo.value;
}

export function withKnobs(storyFn) {
  const channel = addons.getChannel();

  return context => {
    if (!stories[context.kind]) {
      stories[context.kind] = {};
    }

    if (!stories[context.kind][context.story]) {
      stories[context.kind][context.story] = {};
    }

    // Change the global knobStore to the one local to this story
    knobStore = stories[context.kind][context.story];

    return <Wrap {...{ context, storyFn, channel, store: knobStore }} />;
  };
}
