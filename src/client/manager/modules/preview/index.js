import createPageBus from 'page-bus';
import initPagebus from './configs/init_pagebus';

export default {
  load({ reduxStore }, a) {
    const bus = createPageBus();
    initPagebus(bus, reduxStore, a);
  },
};
