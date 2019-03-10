import React from 'react';
import { Route } from '@storybook/router';
import { history } from 'global';

import { Consumer } from '../core/context';
import ShortcutsScreen from './shortcuts';

export default () => (
  <Route path="shortcuts">
    <Consumer>
      {({
        api: { getShortcutKeys, setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts },
      }) => (
        <Route path="shortcuts">
          <ShortcutsScreen
            shortcutKeys={getShortcutKeys()}
            {...{ setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts }}
            onClose={() => history.back()}
          />
        </Route>
      )}
    </Consumer>
  </Route>
);
