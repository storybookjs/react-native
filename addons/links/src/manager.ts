import addons from '@storybook/addons';

import EVENTS, { ADDON_ID } from './constants';

export const register = () => {
  addons.register(ADDON_ID, api => {
    api.on(EVENTS.REQUEST, ({ kind, name }) => {
      const id = api.storyId(kind, name);
      api.emit(EVENTS.RECEIVE, id);
    });
  });
};
