import addons from '@storybook/addons';
import { window } from 'global';
import { parse } from 'qs';
import { getContextNodes, getPropsMap, getRendererFrom, singleton } from './libs';
import { deserialize } from '../shared/serializers';
import {
  PARAM,
  REBOOT_MANAGER,
  UPDATE_PREVIEW,
  UPDATE_MANAGER,
  FORCE_RE_RENDER,
  SET_CURRENT_STORY,
} from '../shared/constants';
import { ContextNode, PropsMap, SelectionState } from '../shared/types.d';

/**
 * A singleton for handling preview-manager and one-time-only side-effects.
 */
export const ContextsPreviewAPI = singleton(() => {
  const channel = addons.getChannel();
  let contextsNodesMemo: ContextNode[] | null = null;
  let selectionState: SelectionState = {};

  /**
   * URL query param can be used to predetermine the contexts a story should render,
   * which is useful for performing image snapshot testing or URL sharing.
   */
  if (window && window.location) {
    selectionState = deserialize(parse(window.location.search)[PARAM]) || {};
  }

  /**
   * (Vue specific)
   * Vue will inject getter/setter watchers on the first rendering of the addon,
   * which is why we have to keep an internal reference and use `Object.assign` to notify the watcher.
   */
  const reactivePropsMap = {};
  const updateReactiveSystem = (propsMap: PropsMap) => Object.assign(reactivePropsMap, propsMap);

  /**
   * Preview-manager communications.
   */
  // from manager
  channel.on(UPDATE_PREVIEW, state => {
    if (state) {
      selectionState = state;
      channel.emit(FORCE_RE_RENDER);
    }
  });
  channel.on(REBOOT_MANAGER, () => {
    channel.emit(UPDATE_MANAGER, contextsNodesMemo);
  });
  channel.on(SET_CURRENT_STORY, () => {
    // trash the memorization since the story-level setting may change (diffing it is much expensive)
    contextsNodesMemo = null;
  });

  // to manager
  const getContextNodesWithSideEffects: typeof getContextNodes = (...arg) => {
    if (contextsNodesMemo === null) {
      contextsNodesMemo = getContextNodes(...arg);
      channel.emit(UPDATE_MANAGER, contextsNodesMemo);
    }
    return contextsNodesMemo;
  };

  /**
   * @Public
   * Exposed interfaces
   */
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
