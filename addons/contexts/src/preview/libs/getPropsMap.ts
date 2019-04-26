/* eslint-disable no-underscore-dangle */
import { OPT_OUT } from '../../shared/constants';
import { ContextNode, GenericProp, PropsMap, SelectionState } from '../../shared/types.d';

/**
 * @private
 * Extract the activated props by name from a given contextual params.
 */
type _getPropsByParamName = (
  params: ContextNode['params'],
  name?: string,
  options?: Partial<ContextNode['options']>
) => GenericProp | typeof OPT_OUT;

export const _getPropsByParamName: _getPropsByParamName = (params, name = '', options = {}) => {
  const { props = null } =
    // when opt-out context
    (options.cancelable && name === OPT_OUT && { props: OPT_OUT }) ||
    // when menu option get selected
    (name && params.find(param => param.name === name)) ||
    // when being initialized
    params.find(param => !!param.default) ||
    // fallback to the first
    params[0] ||
    // fallback for destructuring
    {};
  return props;
};

/**
 * @nosideeffects
 * Collect the propsMap from Nodes based on a controlled state tracker.
 */
type getPropsMap = (contextNodes: ContextNode[], selectionState: SelectionState) => PropsMap;

export const getPropsMap: getPropsMap = (contextNodes, selectionState) =>
  contextNodes.reduce((agg, { nodeId, params, options }) => {
    // eslint-disable-next-line no-param-reassign
    agg[nodeId] = _getPropsByParamName(params, selectionState[nodeId], options);
    return agg;
  }, Object());
