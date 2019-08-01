/* eslint no-underscore-dangle: 0 */

import { navigator } from 'global';
import escape from 'escape-html';
import { getQueryParams } from '@storybook/client-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Channel } from '@storybook/channels';

import KnobStore, { KnobStoreKnob } from './KnobStore';
import { Knob, KnobType, Mutable } from './type-defs';
import { SET } from './shared';

import { deserializers } from './converters';

const knobValuesFromUrl: Record<string, string> = Object.entries(getQueryParams()).reduce(
  (acc, [k, v]) => {
    if (k.includes('knob-')) {
      return { ...acc, [k.replace('knob-', '')]: v };
    }
    return acc;
  },
  {}
);

// This is used by _mayCallChannel to determine how long to wait to before triggering a panel update
const PANEL_UPDATE_INTERVAL = 400;

function escapeStrings(obj: { [key: string]: string }): { [key: string]: string };
function escapeStrings(obj: (string | string[])[]): (string | string[])[];
function escapeStrings(obj: string): string;
function escapeStrings(obj: any): any {
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
  return Object.entries<{ [key: string]: string }>(obj).reduce((acc, [key, oldValue]) => {
    const newValue = escapeStrings(oldValue);
    return newValue === oldValue ? acc : { ...acc, [key]: newValue };
  }, obj);
}

interface KnobManagerOptions {
  escapeHTML?: boolean;
  disableDebounce?: boolean;
}

export default class KnobManager {
  knobStore = new KnobStore();

  channel: Channel | undefined;

  options: KnobManagerOptions = {};

  calling: boolean = false;

  setChannel(channel: Channel) {
    this.channel = channel;
  }

  setOptions(options: KnobManagerOptions) {
    this.options = options;
  }

  getKnobValue({ value }: Knob) {
    return this.options.escapeHTML ? escapeStrings(value) : value;
  }

  knob<T extends KnobType = any>(name: string, options: Knob<T>): Mutable<Knob<T>['value']> {
    this._mayCallChannel();

    const knobName = options.groupId ? `${name}_${options.groupId}` : name;

    const { knobStore } = this;
    const existingKnob = knobStore.get(knobName);

    // We need to return the value set by the knob editor via this.
    // Normally the knobs are reset and so re-use is safe as long as the types match
    // when in storyshots, though the change event isn't called and so the knobs aren't reset, making this code fail
    // so always create a new knob when in storyshots
    if (
      existingKnob &&
      options.type === existingKnob.type &&
      navigator &&
      // userAgent is not set in react-native
      (!navigator.userAgent || !navigator.userAgent.includes('jsdom'))
    ) {
      return this.getKnobValue(existingKnob);
    }

    const knobInfo: Knob<T> & { name: string; label: string; defaultValue?: any } = {
      ...options,
      name: knobName,
      label: name,
    };

    if (knobValuesFromUrl[knobName]) {
      const value = deserializers[options.type](knobValuesFromUrl[knobName]);

      knobInfo.defaultValue = value;
      knobInfo.value = value;

      delete knobValuesFromUrl[knobName];
    } else {
      knobInfo.defaultValue = options.value;
    }

    knobStore.set(knobName, knobInfo as KnobStoreKnob);
    return this.getKnobValue(knobStore.get(knobName));
  }

  _mayCallChannel() {
    // Re rendering of the story may cause changes to the knobStore. Some new knobs maybe added and
    // Some knobs may go unused. So we need to update the panel accordingly. For example remove the
    // unused knobs from the panel. This function sends the `setKnobs` message to the channel
    // triggering a panel re-render.

    if (!this.channel) {
      // to prevent call to undefined channel and therefore throwing TypeError
      return;
    }

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
      if (this.channel) this.channel.emit(SET, { knobs: this.knobStore.getAll(), timestamp });
    }, PANEL_UPDATE_INTERVAL);
  }
}
