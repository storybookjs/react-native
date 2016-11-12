import ShortcutsHelp from '../components/shortcuts_help';
import genReduxLoader from '../libs/gen_redux_loader';
import compose from '../../../compose';

export const mapper = ({ ui }, props, { actions }) => {
  const actionMap = actions();
  const data = {
    isOpen: ui.showShortcutsHelp,
    onClose: actionMap.ui.toggleShortcutsHelp,
    platform: window.navigator.platform.toLowerCase(),
  };

  return data;
};

export default compose(genReduxLoader(mapper))(ShortcutsHelp);
