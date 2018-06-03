import React from 'react';
import ReactDOM from 'react-dom';

import ReactModal from 'react-modal';
import Layout from './containers/layout';
import StoriesPanel from './containers/stories_panel';
import AddonPanel from './containers/addon_panel';
import ShortcutsHelp from './containers/shortcuts_help';
import SearchBox from './containers/search_box';

export default function(injectDeps, { clientStore, provider, domNode }) {
  const state = clientStore.getAll();
  // generate preview
  const Preview = () => {
    const preview = provider.renderPreview(state.selectedKind, state.selectedStory);
    return preview;
  };

  // Tell react-modal which element to mark as aria-hidden
  ReactModal.setAppElement(domNode);

  const Container = process.env.STORYBOOK_EXAMPLE_APP ? React.StrictMode : 'div';

  const root = (
    <Container>
      <Layout
        storiesPanel={() => <StoriesPanel />}
        preview={() => <Preview />}
        addonPanel={() => <AddonPanel />}
        shortcutsHelp={() => <ShortcutsHelp />}
        searchBox={() => <SearchBox />}
      />
    </Container>
  );
  ReactDOM.render(root, domNode);
}
