import { inject } from 'mobx-react';
import { window } from 'global';

import ShortcutsHelp from '../components/shortcuts_help';

export const mapper = store => ({
  isOpen: store.showShortcutsHelp,
  onClose: () => store.toggleShortcutsHelp(),
  platform: window.navigator.platform.toLowerCase(),
});

export default inject(({ store }) => mapper(store))(ShortcutsHelp);
