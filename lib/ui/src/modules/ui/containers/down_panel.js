import DownPanel from '../components/down_panel';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export function mapper(state, props, { context, actions }) {
  const panels = context().provider.getPanels();
  const actionMap = actions();
  const selectedPanel = state.selectedAddonPanel;

  return {
    panels,
    selectedPanel,
    onPanelSelect: actionMap.ui.selectDownPanel,
  };
}

export default compose(genPoddaLoader(mapper))(DownPanel);
