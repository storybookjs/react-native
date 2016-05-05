import ShortcutsHelp from '../components/shortcuts_help';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';

export const composer = ({ ui }, { actions }) => {
  const actionMap = actions();
  const data = {
    isOpen: ui.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp,
  };

  return data;
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(ShortcutsHelp);
