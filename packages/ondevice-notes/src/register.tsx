import { API, addons, types } from '@storybook/core/manager-api';
import { Notes } from './components/Notes';
import { ComponentType, ReactElement } from 'react';
import type { Args, StoryContextForLoaders } from '@storybook/csf';
import type { Renderer } from '@storybook/core/types';
export const PARAM_KEY = 'notes';
import type { Channel } from '@storybook/core/channels';

export interface Selection {
  storyId: string;
  viewMode: 'story';
}

export interface ReactNativeFramework extends Renderer {
  component: ComponentType<any>;
  storyResult: ReactElement<unknown>;
}

export type StoryFromId = Omit<StoryContextForLoaders<ReactNativeFramework, Args>, 'viewMode'>;

type ApiStore = {
  fromId: (id: any) => StoryFromId;
  getSelection: () => Selection;
  _channel: Channel;
};

export type RNAddonApi = API & { store: () => ApiStore };

addons.register('storybook/notes', (api: RNAddonApi) => {
  addons.add('storybook/notes/panel', {
    type: types.PANEL,
    title: 'Notes',
    render: ({ active }) => <Notes api={api} active={active} />,
    paramKey: PARAM_KEY,
  });
});
