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

function createKnob(name, value, type) {
  if (knobStore[name]) {
    return knobStore[name].value;
  }

  knobStore[name] = { name, value, type };
  return value;
}

function wrap(storyFn) {
  const channel = addons.getChannel();
  const localKnobStore = {};

  return context => {
    // Change the global knobStore to the one local to this story
    knobStore = localKnobStore;
    return <Wrap {...{ context, storyFn, channel, store: localKnobStore }} />;
  };
}

export { register, createKnob, wrap };
