import ShortcutsHelp from '../components/shortcuts_help';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';
import getShortcuts from '../../../libs/shortcuts';

export const composer = ({ ui }, { actions }) => {
  const actionMap = actions();
  const data = {
    isOpen: ui.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp,
    shortcuts: getShortcuts(),
  };

  return data;
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(ShortcutsHelp);
