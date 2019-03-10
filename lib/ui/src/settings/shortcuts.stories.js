import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import ShortcutsScreen from './shortcuts';
import { defaultShortcuts } from '../core/shortcuts';

const actions = makeActions(
  'setShortcut',
  'restoreDefaultShortcut',
  'restoreAllDefaultShortcuts',
  'onClose'
);

export default {
  component: ShortcutsScreen,
  title: 'UI|Settings/ShortcutsScreen',
  decorators: [
    s => (
      <div
        style={{
          position: 'relative',
          height: 'calc(100vh)',
          width: 'calc(100vw)',
        }}
      >
        {s()}
      </div>
    ),
  ],
};

export const defaults = () => <ShortcutsScreen shortcutKeys={defaultShortcuts} {...actions} />;
defaults.title = 'default shortcuts';
