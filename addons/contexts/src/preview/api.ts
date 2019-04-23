import addons from '@storybook/addons';
import { FORCE_RE_RENDER, SET_CURRENT_STORY } from '@storybook/core-events';
import { REBOOT_MANAGER, UPDATE_PREVIEW, UPDATE_MANAGER } from '../constants';
import { getContextNodes, getPropsMap, getRendererFrom, singleton } from './libs';
import { ContextNode, PropsMap } from '../types';

/**
 * @Public
 * A singleton for handling wrapper-manager side-effects
 */
export const addonContextsAPI = singleton(() => {
  const channel = addons.getChannel();
  let memorizedNodes: null | ContextNode[] = null;
  let selectionState = {};

  // from manager
  channel.on(SET_CURRENT_STORY, () => (memorizedNodes = null));
  channel.on(REBOOT_MANAGER, () => channel.emit(UPDATE_MANAGER, memorizedNodes, selectionState));
  channel.on(UPDATE_PREVIEW, state => (selectionState = Object.freeze(state)));
  channel.on(UPDATE_PREVIEW, () => channel.emit(FORCE_RE_RENDER));

  // to manager
  const getContextNodesWithSideEffects: typeof getContextNodes = (...arg) => {
    // we want to notify the manager only when the story changed since `parameter` can be changed
    if (memorizedNodes === null) {
      memorizedNodes = getContextNodes(...arg);
      channel.emit(UPDATE_MANAGER, memorizedNodes);
    }
    return memorizedNodes;
  };

  /**
   * (Vue specific)
   * Vue will inject getter/setters on the first rendering of the addon,
   * which is the reason why we have to keep an internal reference and use `Object.assign` to update it.
   */
  let reactivePropsMap = {};
  const updateReactiveSystem = (propsMap: PropsMap) =>
    /* tslint:disable:prefer-object-spread */
    Object.assign(reactivePropsMap, propsMap);

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
