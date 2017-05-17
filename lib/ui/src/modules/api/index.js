import actions from './actions';
import initApi from './configs/init_api';

export default {
  actions,
  defaultState: {
    uiOptions: {
      name: 'STORYBOOK',
      url: 'https://github.com/storybooks/storybook',
      sortStoriesByKind: false,
    },
  },
  load({ clientStore, provider }, _actions) {
    initApi(provider, clientStore, _actions);
  },
};
