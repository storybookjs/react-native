import React from 'react';
import { autorun } from 'mobx';
import qs from 'qs';

import keyEvents from './libs/key_events';
import Layout from './modules/ui/containers/layout';
import StoriesPanel from './modules/ui/containers/stories_panel';
import AddonPanel from './modules/ui/containers/addon_panel';
import ShortcutsHelp from './modules/ui/containers/shortcuts_help';
import SearchBox from './modules/ui/containers/search_box';

class App extends React.Component {
  parseInitialRoute() {
    const { location, store } = this.props;

    const {
      selectedKind,
      selectedStory,
      full = 0,
      down = 1,
      addons = down,
      left = 1,
      stories = left,
      panelRight = 0,
      downPanel,
      addonPanel = downPanel,
      ...customQueryParams
    } = qs.parse(location.search.substring(1));

    if (selectedKind) {
      store.selectStory(selectedKind, selectedStory);
    }

    store.setShortcutsOptions({
      goFullScreen: Boolean(Number(full)),
      showAddonPanel: Boolean(Number(addons)),
      showStoriesPanel: Boolean(Number(stories)),
      addonPanelInRight: Boolean(Number(panelRight))
    });

    if (addonPanel) {
      store.selectAddonPanel(addonPanel);
    }
    store.setQueryParams(customQueryParams);
  }

  initUrlUpdater() {
    const { history, store } = this.props;

    this.cancelHistoryWatching = autorun(() => {
      const {
        selectedKind,
        selectedStory,
        selectedAddonPanel,
        shortcutOptions: {
          goFullScreen,
          showAddonPanel,
          showStoriesPanel,
          addonPanelInRight
        }
      } = store;

      history.push({
        pathname: '/',
        search: qs.stringify({
          selectedKind: selectedKind,
          selectedStory: selectedStory,
          full: Number(goFullScreen),
          addons: Number(showAddonPanel),
          stories: Number(showStoriesPanel),
          panelRight: Number(addonPanelInRight),
          addonPanel: selectedAddonPanel
        })
      });
    });
  }

  initKeysHandler() {
    const { store } = this.props;
    document.addEventListener('keydown', e => {
      const parsedEvent = keyEvents(e);
      if (parsedEvent) {
        store.handleEvent(parsedEvent);
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.initKeysHandler();
      this.parseInitialRoute();
      // this.initUrlUpdater();
    }, 0);
  }

  componentWillUnmount() {
    this.cancelHistoryWatching();
  }

  shouldComponentUpdate() {
    return false;
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
