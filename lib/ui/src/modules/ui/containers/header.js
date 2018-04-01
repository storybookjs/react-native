import pick from 'lodash.pick';
import Header from '../components/header';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = (state, props, { actions }) => {
  const currentOptions = pick(
    state.shortcutOptions,
    'showStoriesPanel',
    'showAddonPanel',
    'goFullScreen',
    'addonPanelInRight'
  );

  const actionMap = actions();
  const { uiOptions, isMobileDevice } = state;
  const { name = '', url = '' } = uiOptions;

  const handleBurgerButtonClick = () => {
    actionMap.shortcuts.setOptions({
      showStoriesPanel: !currentOptions.showStoriesPanel,
    });
  };

  const addonPanelInRight = isMobileDevice ? false : currentOptions.addonPanelInRight;

  return {
    name,
    url,
    ...currentOptions,
    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    onBurgerButtonClick: handleBurgerButtonClick,
    isMobileDevice,
    addonPanelInRight,
  };
};

export default compose(genPoddaLoader(mapper))(Header);
