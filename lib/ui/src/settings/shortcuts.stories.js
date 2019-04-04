import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import ShortcutsScreen from './shortcuts';

const defaultShortcuts = {
  fullScreen: ['F'],
  togglePanel: ['A'],
  panelPosition: ['D'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['ctrl', 'shift', ','],
  aboutPage: [','],
  escape: ['escape'], // This one is not customizable
};

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
