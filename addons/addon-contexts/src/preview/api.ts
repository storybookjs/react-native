import addons from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { UPDATE_PREVIEW, UPDATE_MANAGER } from '../constants';
import { getContextNodes, getPropsMap, aggregateContexts } from './libs';
import { singleton } from './libs/functionals';
import { GetContextNodes } from '../@types';

/**
 * @Public
 * A singleton for handling wrapper-manager side-effects
 */
export const addonContextsAPI = singleton(() => {
  let selectionState = {};
  const channel = addons.getChannel();

  // from manager
  channel.on(UPDATE_PREVIEW, (state) => (selectionState = Object.freeze(state)));
  channel.on(UPDATE_PREVIEW, () => channel.emit(FORCE_RE_RENDER));

  // to manager
  const getContextNodesWithSideEffects: GetContextNodes = (...arg) => {
    const nodes = getContextNodes(...arg);
    channel.emit(UPDATE_MANAGER, nodes);
    return nodes;
  };

  return {
    aggregate: aggregateContexts,
    getSelectionState: () => selectionState,
    getContextNodes: getContextNodesWithSideEffects,
    getPropsMap,
  };
});
