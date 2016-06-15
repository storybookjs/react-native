import createPageBus from 'page-bus';
import initPagebus from './configs/init_pagebus';

export default {
  load({ reduxStore, provider }, actions) {
    initPagebus(provider, reduxStore, actions);
  },
};
