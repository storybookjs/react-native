import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './containers/layout';
import LeftPanel from './containers/left_panel';
import DownPanel from './containers/down_panel';
import ShortcutsHelp from './containers/shortcuts_help';
import SearchBox from './containers/search_box';

export default function (injectDeps, { reduxStore, provider, domNode }) {
  const InjectedLayout = injectDeps(Layout);
  const InjectedShortcutsHelp = injectDeps(ShortcutsHelp);
  const InjectedSearchBox = injectDeps(SearchBox);

  // generate preview
  const Preview = () => {
    const { api } = reduxStore.getState();
    const preview =
      provider.renderPreview(api.selectedKind, api.selectedStory);
    return preview;
  };

  const root = (
    <div>
      <InjectedLayout
        leftPanel={() => (<LeftPanel />)}
        preview={() => (<Preview />)}
        downPanel={() => (<DownPanel />)}
      />
      <InjectedShortcutsHelp />
      <InjectedSearchBox />
    </div>
  );
  ReactDOM.render(root, domNode);
}
