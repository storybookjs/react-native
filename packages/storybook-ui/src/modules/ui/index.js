import routes from './routes';
import actions from './actions';
import initPanels from './configs/init_panels';
import handleRouting from './configs/handle_routing';
import handleKeyEvents from './configs/handle_keyevents';

export default {
  routes,
  actions,
  defaultState: {
    showShortcutsHelp: false,
  },
  load(c, a) {
    initPanels(c, a);
    handleRouting(c, a);
    handleKeyEvents(a);
  },
};
