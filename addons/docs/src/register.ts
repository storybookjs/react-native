import addons, { types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID } from './shared';

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.TAB,
    title: 'Docs',
    route: ({ storyId }) => `/docs/${storyId}`,
    match: ({ viewMode }) => viewMode === 'docs',
    render: () => null,
  });
});
