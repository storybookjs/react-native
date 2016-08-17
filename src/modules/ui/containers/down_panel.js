import DownPanel from '../components/down_panel';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';

export function composer({ ui }, { context, actions }) {
  const panels = context().provider.getPanels();
  const actionMap = actions();
  const selectedPanel = ui.selectedDownPanel || Object.keys(panels)[0];

  return {
    panels,
    selectedPanel,
    onPanelSelect: actionMap.ui.selectDownPanel,
  };
}

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(DownPanel);
