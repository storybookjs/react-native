import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, PANEL_ID } from './constants';
import { InteractionsPanel } from './InteractionsPanel';
import { createInteractionsStore } from './store';

// An on-device version of the web Interactions panel: it lists the `expect` and `step` calls from
// a story's play function, and can rerun the story.
export function registerInteractionsAddon() {
  addons.register(ADDON_ID, () => {
    const store = createInteractionsStore(addons.getChannel());
    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Interactions',
      render: ({ active }) => <InteractionsPanel active={!!active} store={store} />,
    });
  });
}
