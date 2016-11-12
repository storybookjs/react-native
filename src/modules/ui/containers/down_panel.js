import DownPanel from '../components/down_panel';
import genReduxLoader from '../libs/gen_redux_loader';
import compose from '../../../compose';

export function mapper({ ui }, props, { context, actions }) {
  const panels = context().provider.getPanels();
  const actionMap = actions();
  const selectedPanel = ui.selectedDownPanel;

  return {
    panels,
    selectedPanel,
    onPanelSelect: actionMap.ui.selectDownPanel,
  };
}

export default compose(genReduxLoader(mapper))(DownPanel);
