import { ReactElement } from 'react';

import { Module } from '../index';
import { Options } from '../store';

export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
  PREVIEW = 'preview',
  NOTES_ELEMENT = 'notes-element',
}

export type Types = types | string;
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
export interface Collection {
  [key: string]: Addon;
}

interface Panels {
  [id: string]: Addon;
}

type StateMerger<S> = (input: S) => S;

interface StoryInput {
  parameters: {
    [parameterName: string]: any;
  };
}

export interface SubAPI {
  getElements: (type: Types) => Collection;
  getPanels: () => Collection;
  getStoryPanels: () => Collection;
  getSelectedPanel: () => string;
  setSelectedPanel: (panelName: string) => void;
  setAddonState<S>(
    addonId: string,
    newStateOrMerger: S | StateMerger<S>,
    options?: Options
  ): Promise<S>;
  getAddonState<S>(addonId: string): S;
}

export function ensurePanel(panels: Panels, selectedPanel?: string, currentPanel?: string) {
  const keys = Object.keys(panels);

  if (keys.indexOf(selectedPanel) >= 0) {
    return selectedPanel;
  }

  if (keys.length) {
    return keys[0];
  }
  return currentPanel;
}

export default ({ provider, store }: Module) => {
  const api: SubAPI = {
    getElements: type => provider.getElements(type),
    getPanels: () => api.getElements(types.PANEL),
    getStoryPanels: () => {
      const allPanels = api.getPanels();
      const { storyId, storiesHash } = store.getState();
      const storyInput = storyId && (storiesHash[storyId] as StoryInput);

      if (!allPanels || !storyInput) {
        return allPanels;
      }

      const { parameters } = storyInput;

      const filteredPanels: Collection = {};
      Object.entries(allPanels).forEach(([id, panel]) => {
        const { paramKey } = panel;
        if (paramKey && parameters && parameters[paramKey] && parameters[paramKey].disabled) {
          return;
        }
        filteredPanels[id] = panel;
      });

      return filteredPanels;
    },
    getSelectedPanel: () => {
      const { selectedPanel } = store.getState();
      return ensurePanel(api.getPanels(), selectedPanel, selectedPanel);
    },
    setSelectedPanel: panelName => {
      store.setState({ selectedPanel: panelName }, { persistence: 'session' });
    },
    setAddonState<S>(
      addonId: string,
      newStateOrMerger: S | StateMerger<S>,
      options?: Options
    ): Promise<S> {
      let nextState;
      const { addons: existing } = store.getState();
      if (typeof newStateOrMerger === 'function') {
        const merger = newStateOrMerger as StateMerger<S>;
        nextState = merger(api.getAddonState<S>(addonId));
      } else {
        nextState = newStateOrMerger;
      }
      return store
        .setState({ addons: { ...existing, [addonId]: nextState } }, options)
        .then(() => api.getAddonState(addonId));
    },
    getAddonState: addonId => {
      return store.getState().addons[addonId];
    },
  };

  return {
    api,
    state: {
      selectedPanel: ensurePanel(api.getPanels(), store.getState().selectedPanel),
      addons: {},
    },
  };
};
