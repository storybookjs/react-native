import { history } from 'global';
import React from 'react';

import { Route } from '@storybook/router';
import { Consumer } from '@storybook/api';

import ShortcutsScreen from './shortcuts';

const mapper = ({ api }) => api;

export default () => (
  <Route path="shortcuts">
    <Consumer filter={mapper}>
      {({ getShortcutKeys, setShortcut, restoreDefaultShortcut, restoreAllDefaultShortcuts }) => (
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
