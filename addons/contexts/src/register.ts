import { createElement } from 'react';
import addons, { types } from '@storybook/addons';
import { ContextsManager } from './manager/ContextsManager';
import { ID } from './shared/constants';

addons.register(ID, api =>
  addons.add(ID, {
    title: ID,
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => createElement(ContextsManager, { api }),
  })
);
