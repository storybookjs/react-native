import initApi from './configs/init_api';

export default {
  load({ reduxStore, provider }, actions) {
    initApi(provider, reduxStore, actions);
  },
};
