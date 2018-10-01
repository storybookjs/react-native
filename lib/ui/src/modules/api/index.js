import actions from './actions';
import initApi from './configs/init_api';
import defaultState from './defaultState';

export default {
  actions,
  defaultState,
  load({ clientStore, provider }, _actions) {
    initApi(provider, clientStore, _actions);
  },
};
