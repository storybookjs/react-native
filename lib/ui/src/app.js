import React from 'react';

import keyEvents from './libs/key_events';
import Layout from './modules/ui/containers/layout';
import StoriesPanel from './modules/ui/containers/stories_panel';
import AddonPanel from './modules/ui/containers/addon_panel';
import ShortcutsHelp from './modules/ui/containers/shortcuts_help';
import SearchBox from './modules/ui/containers/search_box';

class App extends React.Component {
  componentDidMount() {
    // Handle events
    document.addEventListener('keydown', e => {
      const parsedEvent = keyEvents(e);
      if (parsedEvent) {
        this.props.store.handleEvent(parsedEvent);
      }
    });
  }

  render() {
    const { provider, store } = this.props;

    const Preview = () =>
      provider.renderPreview(store.selectedKind, store.selectedStory);

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

export default App;
