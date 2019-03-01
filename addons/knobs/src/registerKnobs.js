import addons from '@storybook/addons';
import { STORY_CHANGED, FORCE_RE_RENDER, REGISTER_SUBSCRIPTION } from '@storybook/core-events';

import KnobManager from './KnobManager';
import { CHANGE, CLICK, RESET, SET } from './shared';

export const manager = new KnobManager();
const { knobStore } = manager;
const KNOB_CHANGED_DEBOUNCE_DELAY_MS = 155; // approximate average time between keypresses
let timeoutId = null;

function forceReRender() {
  addons.getChannel().emit(FORCE_RE_RENDER);
}

function setPaneKnobs(timestamp = +new Date()) {
  const channel = addons.getChannel();
  channel.emit(SET, { knobs: knobStore.getAll(), timestamp });
}

function knobChanged(change) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    // debouncing occurs here to increase performance
    const { name, value } = change;

    // Update the related knob and it's value.
    const knobOptions = knobStore.get(name);

    knobOptions.value = value;
    knobStore.markAllUnused();

    forceReRender();
  }, DEBOUNCE_DELAY_MS); // amount of time used to ensure that the user has time to type before re-rendering
}

function knobClicked(clicked) {
  const knobOptions = knobStore.get(clicked.name);
  knobOptions.callback();
  forceReRender();
}

function resetKnobs() {
  knobStore.reset();

  setPaneKnobs(false);
}

function resetKnobsAndForceReRender() {
  knobStore.reset();

  forceReRender();

  setPaneKnobs(false);
}

function disconnectCallbacks() {
  const channel = addons.getChannel();
  channel.removeListener(CHANGE, knobChanged);
  channel.removeListener(CLICK, knobClicked);
  channel.removeListener(STORY_CHANGED, resetKnobs);
  channel.removeListener(RESET, resetKnobsAndForceReRender);
  knobStore.unsubscribe(setPaneKnobs);
}

function connectCallbacks() {
  const channel = addons.getChannel();
  channel.on(CHANGE, knobChanged);
  channel.on(CLICK, knobClicked);
  channel.on(STORY_CHANGED, resetKnobs);
  channel.on(RESET, resetKnobsAndForceReRender);
  knobStore.subscribe(setPaneKnobs);

  return disconnectCallbacks;
}

export function registerKnobs() {
  addons.getChannel().emit(REGISTER_SUBSCRIPTION, connectCallbacks);
}
