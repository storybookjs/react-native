import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import KnobManager from './KnobManager';
import { CHANGE, CLICK, RESET, SET } from './shared';

export const manager = new KnobManager();
const { knobStore } = manager;

function forceReRender() {
  addons.getChannel().emit(Events.FORCE_RE_RENDER);
}

function setPaneKnobs(timestamp = +new Date()) {
  const channel = addons.getChannel();
  channel.emit(SET, { knobs: knobStore.getAll(), timestamp });
}

function knobChanged(change) {
  const { name, value } = change;

  // Update the related knob and it's value.
  const knobOptions = knobStore.get(name);

  knobOptions.value = value;
  knobStore.markAllUnused();

  forceReRender();
}

function knobClicked(clicked) {
  const knobOptions = knobStore.get(clicked.name);
  knobOptions.callback();
  forceReRender();
}

function resetKnobs() {
  knobStore.reset();

  forceReRender();

  setPaneKnobs(false);
}

function disconnectCallbacks() {
  const channel = addons.getChannel();
  channel.removeListener(CHANGE, knobChanged);
  channel.removeListener(CLICK, knobClicked);
  channel.removeListener(RESET, resetKnobs);
  knobStore.unsubscribe(setPaneKnobs);
}

function connectCallbacks() {
  const channel = addons.getChannel();
  channel.on(CHANGE, knobChanged);
  channel.on(CLICK, knobClicked);
  channel.on(RESET, resetKnobs);
  knobStore.subscribe(setPaneKnobs);

  return disconnectCallbacks;
}

export function registerKnobs() {
  addons.getChannel().emit(Events.REGISTER_SUBSCRIPTION, connectCallbacks);
}
