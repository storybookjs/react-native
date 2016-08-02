import DownPanel from '../components/down_panel';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';

export function composer({}, { context }) {
  return {
    panels: context().provider.getPanels(),
  };
}

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(DownPanel);
