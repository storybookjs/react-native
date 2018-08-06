import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter, Route } from 'react-router-dom';

import { Provider } from './state';

import Layout from './modules/ui/containers/layout';
import StoriesPanel from './modules/ui/containers/stories_panel';
import AddonPanel from './modules/ui/containers/addon_panel';
import ShortcutsHelp from './modules/ui/containers/shortcuts_help';
import SearchBox from './modules/ui/containers/search_box';

function ensureKind(storyKinds, selectedKind) {
  if (!storyKinds) return selectedKind;

  const found = storyKinds.find(item => item.kind === selectedKind);
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  const kinds = storyKinds.map(item => item.kind);
  return kinds[0];
}

function ensureStory(storyKinds, selectedKind, selectedStory) {
  if (!storyKinds) return selectedStory;

  const kindInfo = storyKinds.find(item => item.kind === selectedKind);
  if (!kindInfo) return null;

  const found = kindInfo.stories.find(item => item === selectedStory);
  if (found) return found;

  // if the selected story is non-existant, select the first story
  return kindInfo.stories[0];
}

/* eslint-disable */
class App extends React.Component {
  static propTypes = {
    provider: PropTypes.shape({
      renderPreview: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    showShortcutsHelp: false,
    storyFilter: null,
    selectedAddonPanel: null,
    isMobileDevice: false,
    shortcutOptions: {
      goFullScreen: false,
      showStoriesPanel: true,
      showAddonPanel: true,
      showSearchBox: false,
      addonPanelInRight: false,
      enableShortcuts: true,
    },
    uiOptions: {
      name: 'STORYBOOK',
      url: 'https://github.com/storybooks/storybook',
      sortStoriesByKind: false,
      hierarchySeparator: '/',
      hierarchyRootSeparator: null,
      sidebarAnimations: true,
      theme: null,
    },
    updateState: this.updateState,
  };

  componentDidMount() {
    const { provider } = this.props;

    provider.handleAPI({
      onStory: (...args) => {},
      setStories: this.setStories,
      selectStory: (...args) => {},
      handleShortcut(...args) {},
    });
  }

  setStories = stories => {
    const selectedKind = ensureKind(stories, this.state.selectedKind);
    const currentSelectedStory =
      this.state.selectedKind === selectedKind ? this.state.selectedStory : null;
    const selectedStory = ensureStory(stories, selectedKind, currentSelectedStory);

    this.setState({
      stories,
      selectedStory,
      selectedKind,
    });
  };

  updateState = (...args) => this.setState(...args);

  render() {
    const { provider } = this.props;
    const { selectedKind, selectedStory } = this.state;

    const Preview = () => provider.renderPreview(selectedKind, selectedStory);

    return (
      <Provider value={this.state}>
        <BrowserRouter>
          <Route
            render={() => (
              <Layout
                preview={() => <Preview />}
                storiesPanel={() => <StoriesPanel />}
                addonPanel={() => <AddonPanel panels={provider.getPanels()} />}
                shortcutsHelp={() => <ShortcutsHelp />}
                searchBox={() => <SearchBox />}
              />
            )}
          />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
