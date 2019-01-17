/* eslint no-underscore-dangle: 0 */
import deepEqual from 'fast-deep-equal';
import escape from 'escape-html';

import KnobStore from './KnobStore';
import { SET } from './shared';

// This is used by _mayCallChannel to determine how long to wait to before triggering a panel update
const PANEL_UPDATE_INTERVAL = 400;

const escapeStrings = obj => {
  if (typeof obj === 'string') {
    return escape(obj);
  }
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const newArray = obj.map(escapeStrings);
    const didChange = newArray.some((newValue, key) => newValue !== obj[key]);
    return didChange ? newArray : obj;
  }
  return Object.entries(obj).reduce((acc, [key, oldValue]) => {
    const newValue = escapeStrings(oldValue);
    return newValue === oldValue ? acc : { ...acc, [key]: newValue };
  }, obj);
};

export default class KnobManager {
  constructor() {
    this.knobStore = new KnobStore();
    this.options = {};
  }

  setChannel(channel) {
    this.channel = channel;
  }

  setOptions(options) {
    this.options = options;
  }

  getKnobValue({ value }) {
    return this.options.escapeHTML ? escapeStrings(value) : value;
  }

  knob(name, options) {
    this._mayCallChannel();

    const { knobStore } = this;
    const existingKnob = knobStore.get(name);
    // We need to return the value set by the knob editor via this.
    // But, if the user changes the code for the defaultValue we should set
    // that value instead.
    if (existingKnob && deepEqual(options.value, existingKnob.defaultValue)) {
      return this.getKnobValue(existingKnob);
    }

    const defaultValue = options.value;
    const knobInfo = {
      ...options,
      name,
      defaultValue,
    };

    knobStore.set(name, knobInfo);
    return this.getKnobValue(knobStore.get(name));
  }

  _mayCallChannel() {
    // Re rendering of the story may cause changes to the knobStore. Some new knobs maybe added and
    // Some knobs may go unused. So we need to update the panel accordingly. For example remove the
    // unused knobs from the panel. This function sends the `setKnobs` message to the channel
    // triggering a panel re-render.

    if (this.calling) {
      // If a call to channel has already registered ignore this call.
      // Once the previous call is completed all the changes to knobStore including the one that
      // triggered this, will be added to the panel.
      // This avoids emitting to the channel within very short periods of time.
      return;
    }
    this.calling = true;
    const timestamp = +new Date();

    setTimeout(() => {
      this.calling = false;
      // emit to the channel and trigger a panel re-render
      this.channel.emit(SET, { knobs: this.knobStore.getAll(), timestamp });
    }, PANEL_UPDATE_INTERVAL);
  }
}
