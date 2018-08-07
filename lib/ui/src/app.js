import React from 'react';
import PropTypes from 'prop-types';

import Layout from './modules/ui/containers/layout';
import StoriesPanel from './modules/ui/containers/stories_panel';
// import AddonPanel from './modules/ui/containers/addon_panel';
import ShortcutsHelp from './modules/ui/containers/shortcuts_help';
// import SearchBox from './modules/ui/containers/search_box';

const App = ({ provider, store }) => {
  const Preview = () => provider.renderPreview(null, null);

  return (
    <Layout
      preview={() => <Preview />}
      storiesPanel={() => <StoriesPanel />}
      addonPanel={() => <div>addonPanel</div>}
      shortcutsHelp={() => <ShortcutsHelp />}
      searchBox={() => <div>searchBox</div>}
      // addonPanel={() => <AddonPanel panels={provider.getPanels()} />}
      // shortcutsHelp={() => <ShortcutsHelp />}
      // searchBox={() => <SearchBox />}
    />
  );
};

export default App;
