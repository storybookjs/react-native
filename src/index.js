import React from 'react';
import addons from '@kadira/storybook-addons';
import Wrap from './components/Wrap';

let knobStore = {};
const stories = {};

function knob(name, type, value) {
  if (knobStore[name]) {
    return knobStore[name].value;
  }

  knobStore[name] = { name, value, type };
  return value;
}

function withKnobs(storyFn) {
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

export { knob, withKnobs };
