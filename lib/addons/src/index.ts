import global from 'global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactElement } from 'react';
import { Channel } from '@storybook/channels';
import { API } from '@storybook/api';
import { logger } from '@storybook/client-logger';
import { types, Types } from './types';

export interface RenderOptions {
  active: boolean;
  key: string;
}
export interface RouteOptions {
  storyId: string;
}
export interface MatchOptions {
  viewMode: string;
}

export interface Addon {
  title: string;
  type?: Types;
  id?: string;
  route?: (routeOptions: RouteOptions) => string;
  match?: (matchOptions: MatchOptions) => boolean;
  render: (renderOptions: RenderOptions) => ReactElement<any>;
  paramKey?: string;
}

export type Loader = (api: API) => void;

interface Loaders {
  [key: string]: Loader;
}
export interface Collection {
  [key: string]: Addon;
}
interface Elements {
  [key: string]: Collection;
}

export class AddonStore {
  constructor() {
    this.promise = new Promise(res => {
      this.resolve = () => res(this.getChannel());
    }) as Promise<Channel>;
  }

  private loaders: Loaders = {};

  private elements: Elements = {};

  private channel: Channel | undefined;

  private promise: any;

  private resolve: any;

  getChannel = (): Channel => {
    // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
    if (!this.channel) {
      throw new Error(
        'Accessing non-existent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
      );
    }

    return this.channel;
  };

  ready = (): Promise<Channel> => this.promise;

  hasChannel = (): boolean => !!this.channel;

  setChannel = (channel: Channel): void => {
    this.channel = channel;
    this.resolve();
  };

  getElements = (type: Types): Collection => {
    if (!this.elements[type]) {
      this.elements[type] = {};
    }
    return this.elements[type];
  };

  addPanel = (name: string, options: Addon): void => {
    this.add(name, {
      type: types.PANEL,
      ...options,
    });
  };

  add = (name: string, addon: Addon) => {
    const { type } = addon;
    const collection = this.getElements(type);
    collection[name] = { id: name, ...addon };
  };

  register = (name: string, registerCallback: (api: API) => void): void => {
    if (this.loaders[name]) {
      logger.warn(`${name} was loaded twice, this could have bad side-effects`);
    }
    this.loaders[name] = registerCallback;
  };

  loadAddons = (api: any) => {
    Object.values(this.loaders).forEach(value => value(api));
  };
}

// Enforce addons store to be a singleton
const KEY = '__STORYBOOK_ADDONS';

function getAddonsStore(): AddonStore {
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
