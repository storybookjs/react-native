import { window } from 'global';
import addons from '@storybook/addons';
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
 * A singleton for handling preview-manager and one-time-only side-effects
 */
export const ContextsPreviewAPI = singleton(() => {
  const channel = addons.getChannel();
  let contextsNodesMemo: ContextNode[] = null;
  let selectionState: SelectionState = {};

  /**
   * URL query param can be used to predetermine the contexts a story should render,
   * which is useful for performing image snapshot testing or URL sharing.
   */
  if (window && window.location) {
    const contextQuery = parse(window.location.search)[PARAM];
    if (contextQuery) {
      selectionState = deserialize(contextQuery);
    }
  }

  /**
   * (Vue specific)
   * Vue will inject getter/setters on the first rendering of the addon,
   * which is the reason why we have to keep an internal reference and use `Object.assign` to update it.
   */
  const reactivePropsMap = {};
  const updateReactiveSystem = (propsMap: PropsMap) =>
    /* tslint:disable:prefer-object-spread */
    Object.assign(reactivePropsMap, propsMap);

  /**
   * Preview-manager communications.
   */
  // from manager
  channel.on(SET_CURRENT_STORY, () => {
    contextsNodesMemo = null;
  });
  channel.on(REBOOT_MANAGER, () => channel.emit(UPDATE_MANAGER, contextsNodesMemo));
  channel.on(UPDATE_PREVIEW, state => {
    if (state) {
      selectionState = state;
      channel.emit(FORCE_RE_RENDER);
    }
  });

  // to manager
  const getContextNodesWithSideEffects: typeof getContextNodes = (...arg) => {
    // we want to notify the manager only when the story changed since `parameter` can be changed
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
