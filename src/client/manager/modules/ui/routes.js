import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './containers/layout';
import Preview from '../preview/containers/preview';
import LeftPanel from './containers/left_panel';
import ActionLogger from './containers/action_logger';
import ShortcutsHelp from './containers/shortcuts_help';

export default function (injectDeps) {
  const InjectedLayout = injectDeps(Layout);
  const InjectedShortcutsHelp = injectDeps(ShortcutsHelp);
  const rootEl = document.getElementById('root');

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
  ReactDOM.render(root, rootEl);
}
