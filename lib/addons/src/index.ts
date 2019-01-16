import global from 'global';
import { ReactElement } from 'react';
import { Channel } from '@storybook/channels';
import logger from '@storybook/client-logger';
import { types, Types, isSupportedType } from './types';
import deprecate from 'util-deprecate';

export interface Options {
  active: boolean;
}

export interface Addon {
  title: string;
  type?: Types;
  id?: string;
  render(options: Options): ReactElement<any>;
}

export type Loader = (callback: (api: any) => void) => void;

export { types, isSupportedType };

interface Loaders {
  [key: string]: Loader;
}
interface Collection {
  [key: string]: Addon;
}
interface Elements {
  [key: string]: Collection;
}

export class AddonStore {
  private loaders: Loaders = {};
  private elements: Elements = {};
  private channel: Channel | undefined;

  getChannel = () => {
    // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
    if (!this.channel) {
      throw new Error('Accessing non-existent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel');
    }

    return this.channel;
  }
  hasChannel = () => !!this.channel;
  setChannel = (channel: Channel) => {
    this.channel = channel;
  }

  getElements = (type: Types): Collection => {
    if (!this.elements[type]) {
      this.elements[type] = {};
    }
    return this.elements[type];
  }
  addPanel = (name: string, options: Addon) => {
    this.add(name, {
      type: types.PANEL,
      ...options,
    });
  }
  add = (name: string, options: Addon) => {
    const { type } = options;

    const collection = this.getElements(type);
    collection[name] = { id: name, ...options };
  }
  register = (name: string, registerCallback: (api: any) => void) => {
    if (this.loaders[name]) {
      logger.warn(`${name} was loaded twice, this could have bad side-effects`);
    }
    this.loaders[name] = registerCallback;
  }

  loadAddons = (api: any) => {
    Object.values(this.loaders).forEach(value => value(api));
  }
}

// Enforce addons store to be a singleton
const KEY = '__STORYBOOK_ADDONS';

function getAddonsStore() {
  if (!global[KEY]) {
    global[KEY] = new AddonStore();
  }
  return global[KEY];
}

// Exporting this twice in order to to be able to import it like { addons } instead of 'addons'
// prefer import { addons } from '@storybook/addons' over import addons from '@storybook/addons'
//
// See public_api.ts
export const addons = getAddonsStore();
