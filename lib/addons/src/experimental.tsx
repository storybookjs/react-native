// import React from 'react';
// import { addons, types } from '@storybook/addons';
// import { Consumer } from '@storybook/api';

// import { ADDON_ID, PANEL_ID } from './constants';

// {
//   /*
// <Consumer filter={({ state, api }) => [state.storyId]}>
//   {(storyId) => <h1>Current story = {storyId}</h1>}
// </Consumer>
// */
// }

// addons.register(ADDON_ID, api => {
//   addons.add(PANEL_ID, {
//     type: types.PANEL,
//     title: 'My Addon',
//     render: ({ active }) => <Consumer>{({ state }) => <h1>Current story = {state.storyId}</h1>}</Consumer>,
//   });
// });

// addons.register(ADDON_ID, api => {
//   addons.add(PANEL_ID, {
//     type: types.PANEL,
//     title: 'My Addon',
//     connect: ({ state: { storyId }, api }) => ({ storyId }),
//     render: ({ active, storyId }) => <h1>Current story = {storyId}</h1>,
//   });
// });
