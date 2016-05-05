import ActionLogger from '../components/action_logger';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';

export function composer({ api }, { actions }) {
  const actionMap = actions();
  const data = {
    onClear: actionMap.api.clearActions,
    actions: api.actions,
  };

  return data;
}

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(ActionLogger);
