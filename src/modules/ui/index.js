import routes from './routes';
import actions from './actions';
import reducers from './configs/reducers';
import handleRouting from './configs/handle_routing';
import handleKeyEvents from './configs/handle_keyevents';

export default {
  routes,
  actions,
  reducers,
  load(c, a) {
    handleRouting(c, a);
    handleKeyEvents(a);
  },
};
