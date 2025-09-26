import { type API, addons, types } from 'storybook/manager-api';
import { Notes } from './components/Notes';

import type { Args, StoryContext } from 'storybook/internal/csf';
import type { ReactRenderer } from '@storybook/react';

import type { Channel } from 'storybook/internal/channels';
export const PARAM_KEY = 'notes';

export interface Selection {
  storyId: string;
  viewMode: 'story';
}

export type StoryFromId = StoryContext<ReactRenderer, Args>;

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
