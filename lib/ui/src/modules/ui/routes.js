import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './containers/layout';
import LeftPanel from './containers/left_panel';
import DownPanel from './containers/down_panel';
import ShortcutsHelp from './containers/shortcuts_help';
import SearchBox from './containers/search_box';

export default function(injectDeps, { clientStore, provider, domNode }) {
  // generate preview
  const Preview = () => {
    const state = clientStore.getAll();
    const preview = provider.renderPreview(state.selectedKind, state.selectedStory);
    return preview;
  };

  const root = (
    <div>
      <Layout
        leftPanel={() => <LeftPanel />}
        preview={() => <Preview />}
        downPanel={() => <DownPanel />}
      />
      <ShortcutsHelp />
      <SearchBox />
    </div>
  );
  ReactDOM.render(root, domNode);
}
