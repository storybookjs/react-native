import React from 'react';
import PropTypes from 'prop-types';

import Layout from './containers/layout';
import StoriesPanel from './containers/stories_panel';
import AddonPanel from './containers/addon_panel';
import ShortcutsHelp from './containers/shortcuts_help';
import SearchBox from './containers/search_box';

class App extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { provider, store } = this.props;

    const Preview = () => provider.renderPreview(store.selectedKind, store.selectedStory);

    return (
      <Layout
        preview={() => <Preview />}
        storiesPanel={() => <StoriesPanel />}
        shortcutsHelp={() => <ShortcutsHelp />}
        searchBox={() => <SearchBox />}
        addonPanel={() => <AddonPanel panels={provider.getPanels()} />}
      />
    );
  }
}

App.propTypes = {
  provider: PropTypes.shape({
    renderPreview: PropTypes.func.isRequired,
    getPanels: PropTypes.func.isRequired,
  }).isRequired,
  store: PropTypes.shape({
    selectedKind: PropTypes.string,
    selectedStory: PropTypes.string,
  }).isRequired,
};

export default App;
