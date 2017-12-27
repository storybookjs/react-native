import pick from 'lodash-es/pick';
import Layout from '../components/layout';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = ({ shortcutOptions }) =>
  pick(shortcutOptions, 'showStoriesPanel', 'showAddonPanel', 'goFullScreen', 'addonPanelInRight');

export default compose(genPoddaLoader(mapper))(Layout);
