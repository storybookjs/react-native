import pick from 'lodash.pick';
import Layout from '../components/layout';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';
import isMobileDevice from '../libs/is_mobile_device';

export const shortcutMapper = state => {
  const currentOptions = pick(
    state.shortcutOptions,
    'showStoriesPanel',
    'showAddonPanel',
    'goFullScreen',
    'addonPanelInRight'
  );

  return {
    ...currentOptions,
    isMobileDevice,
  };
};

export default compose(genPoddaLoader(shortcutMapper))(Layout);
