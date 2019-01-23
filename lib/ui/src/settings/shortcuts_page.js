import React from 'react';
import { Route } from '@storybook/router';

import { Consumer } from '../core/context';
import ShortcutsScreen from './shortcuts';

export default () => (
  <Route path="shortcuts">
    <Consumer>
      {({
        api: { getShortcutKeys, setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts },
      }) => (
        <ShortcutsScreen
          shortcutKeys={getShortcutKeys()}
          {...{ setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts }}
        />
      )}
    </Consumer>
  </Route>
);
