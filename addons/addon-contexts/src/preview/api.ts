import addons from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { UPDATE_PREVIEW, UPDATE_MANAGER } from '../constants';
import { getContextNodes, getPropsMap, getRendererFrom, singleton } from './libs';
import { GenericProp, GetContextNodes } from '../@types';

/**
 * @Public
 * A singleton for handling wrapper-manager side-effects
 */
export const addonContextsAPI = singleton(() => {
  const channel = addons.getChannel();
  let selectionState = {};

  // from manager
  channel.on(UPDATE_PREVIEW, (state) => (selectionState = Object.freeze(state)));
  channel.on(UPDATE_PREVIEW, () => channel.emit(FORCE_RE_RENDER));

  // to manager
  const getContextNodesWithSideEffects: GetContextNodes = (...arg) => {
    const nodes = getContextNodes(...arg);
    channel.emit(UPDATE_MANAGER, nodes);
    return nodes;
  };

  // (Vue) hold a reference for updating props in its reactive system
  let reactivePropsMap = {};
  const updateReactiveSystem = (propsMap: GenericProp) => Object.assign(reactivePropsMap, propsMap);

  return {
    // methods get called on Storybook event lifecycle
    getContextNodes: getContextNodesWithSideEffects,
    getSelectionState: () => selectionState,
    getPropsMap,

    // methods for processing framework specific bindings
    getRendererFrom,
    updateReactiveSystem,
  };
});
