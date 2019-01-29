import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';
import { defaultShortcuts } from '@storybook/api/dist/modules/shortcuts';

import ShortcutsScreen from './shortcuts';

const actions = makeActions('setShortcut', 'restoreDefaultShortcut', 'restoreAllDefaultShortcuts');

export default {
  component: ShortcutsScreen,
  title: 'UI|ShortcutPage',
  module,
};

export const defaults = () => <ShortcutsScreen shortcutKeys={defaultShortcuts} {...actions} />;
defaults.title = 'default shortcuts';
