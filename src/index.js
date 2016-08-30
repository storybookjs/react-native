import React from 'react';
import addons from '@kadira/storybook-addons';
import Panel from './components/Panel';
import Wrap from './components/Wrap';


function register() {
  addons.register('kadirahq/storybook-addon-knobs', api => {
    const channel = addons.getChannel();

    addons.addPanel('kadirahq/storybook-addon-knobs', {
      title: 'Knobs',
      render: () => {
        return <Panel channel={channel} api={api} key="knobs-panel" />;
      },
    });
  });
}

let knobStore = {};
const stories = {};

function createKnob(name, value, type) {
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

export { register, createKnob, withKnobs };
