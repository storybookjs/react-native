import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './containers/layout';
import LeftPanel from './containers/left_panel';
import ActionLogger from './containers/action_logger';
import ShortcutsHelp from './containers/shortcuts_help';

export default function (injectDeps, { reduxStore, provider, domNode }) {
  const InjectedLayout = injectDeps(Layout);
  const InjectedShortcutsHelp = injectDeps(ShortcutsHelp);

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
        downPanel={() => (<ActionLogger />)}
      />
      <InjectedShortcutsHelp />
    </div>
  );
  ReactDOM.render(root, domNode);
}
