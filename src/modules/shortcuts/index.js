import actions from './actions';
import reducers from './configs/reducers';

export default {
  reducers,
  actions,
  defaultState: {
    shortcutOptions: {
      goFullScreen: false,
      showLeftPanel: true,
      showDownPanel: true,
      showSearchBox: false,
      downPanelInRight: false,
    }
  }
};
