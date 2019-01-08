import global from 'global';
import { Channel } from '@storybook/channels';
import { ReactElement } from 'react';

export interface PanelOptions {
  active: boolean;
}

export interface Panel {
  title: string;

  render(options: PanelOptions): ReactElement<any>;
}

export type Loader = (callback: (api: any) => void) => void;

interface LoaderKeyValue {
  [key: string]: Loader;
}

interface PanelKeyValue {
  [key: string]: Panel;
}

export class AddonStore {
  private loaders: LoaderKeyValue = {};
  private panels: PanelKeyValue = {};
  private channel: Channel | undefined;

  getChannel(): Channel {
    // this.channel should get overwritten by setChannel. If it wasn't called (e.g. in non-browser environment), throw.
    if (!this.channel) {
      throw new Error(
        'Accessing nonexistent addons channel, see https://storybook.js.org/basics/faq/#why-is-there-no-addons-channel'
      );
    }

    return this.channel;
  }

  hasChannel(): boolean {
    return !!this.channel;
  }

  setChannel(channel: Channel): void {
    this.channel = channel;
  }

  getPanels(): PanelKeyValue {
    return this.panels;
  }

  addPanel(name: string, panel: Panel): void {
    this.panels[name] = panel;
  }

  register(name: string, registerCallback: (api: any) => void): void {
    this.loaders[name] = registerCallback;
  }

  loadAddons(api: any): void {
    Object.values(this.loaders).forEach(value => value(api));
  }
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
