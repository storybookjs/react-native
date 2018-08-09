import React from 'react';
import PropTypes from 'prop-types';

import Layout from './containers/layout';
import StoriesPanel from './containers/stories_panel';
import AddonPanel from './containers/addon_panel';
import ShortcutsHelp from './containers/shortcuts_help';
import SearchBox from './containers/search_box';

const App = ({ preview: Preview }) => (
  <Layout
    preview={() => <Preview />}
    storiesPanel={() => <StoriesPanel />}
    shortcutsHelp={() => <ShortcutsHelp />}
    searchBox={() => <SearchBox />}
    addonPanel={() => <AddonPanel />}
  />
);

App.propTypes = {
  preview: PropTypes.func.isRequired,
};

export default App;
