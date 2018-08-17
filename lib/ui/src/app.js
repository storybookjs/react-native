import React from 'react';
import { Route } from '@storybook/components';

import Root from './containers/root';
import Nav from './containers/nav';

import Preview from './containers/preview_panel';
import Panel from './containers/addon_panel';

// import ShortcutsHelp from './containers/shortcuts_help';
// import SearchBox from './containers/search_box';

// shortcutsHelp={() => <ShortcutsHelp />}
// searchBox={() => <SearchBox />}
const App = () => (
  <Route render={props => <Root {...props} Preview={Preview} Nav={Nav} Panel={Panel} />} />
);

export default App;
