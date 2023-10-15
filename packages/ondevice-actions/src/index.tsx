import { ADDON_ID, PANEL_ID, PARAM_KEY } from '@storybook/addon-actions';
import { API, addons, types } from '@storybook/manager-api';
import ActionLogger from './containers/ActionLogger';
import type { Args, StoryContextForLoaders } from '@storybook/csf';
import type { Renderer } from '@storybook/types';
import { ComponentType, ReactElement } from 'react';
import { Channel } from '@storybook/channels';

export interface Selection {
  storyId: string;
  viewMode: 'story';
}

export interface ReactNativeFramework extends Renderer {
  component: ComponentType<any>;
  storyResult: ReactElement<unknown>;
}

type ApiStore = {
  fromId: (id: any) => Omit<StoryContextForLoaders<ReactNativeFramework, Args>, 'viewMode'>;
  getSelection: () => Selection;
  _channel: Channel;
};

export type RNAddonApi = API & { store: () => ApiStore };

export function register() {
  addons.register(ADDON_ID, (api: RNAddonApi) => {
    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Actions',
      render: ({ active }) => <ActionLogger active={active} api={api} />,
      paramKey: PARAM_KEY,
    });
  });
}
