import React from 'react';
import WrapStory from './components/WrapStory';
import KnobStore from './KnobStore';
import deepEqual from 'deep-equal';

export default class KnobManager {
  constructor() {
    this.knobStore = null;
    this.knobStoreMap = {};
  }

  knob(name, options) {
    const knobStore = this.knobStore;
    const existingKnob = knobStore.get(name);
    // We need to return the value set by the knob editor via this.
    // But, if the user changes the code for the defaultValue we should set
    // that value instead.
    if (existingKnob && deepEqual(options.value, existingKnob.defaultValue)) {
      return existingKnob.value;
    }

    const defaultValue = options.value;
    const knobInfo = {
      ...options,
      name,
      defaultValue,
    };

    knobStore.set(name, knobInfo);
    return knobStore.get(name).value;
  }

  wrapStory(channel, storyFn, context) {
    const key = `${context.kind}:::${context.story}`;
    let knobStore = this.knobStoreMap[key];

    if (!knobStore) {
      knobStore = this.knobStoreMap[key] = new KnobStore();
    }
    this.knobStore = knobStore;

    const props = { context, storyFn, channel, knobStore };
    return (<WrapStory {...props} />);
  }
}
