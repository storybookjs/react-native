import { window } from 'global';
import { ShortcutsHelp } from '../components/shortcuts_help';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  const data = {
    isOpen: state.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp,
    platform: window.navigator.platform.toLowerCase(),
  };

  return data;
};

export default compose(genPoddaLoader(mapper))(ShortcutsHelp);
