import { OPT_OUT } from '../../constants';
import { ContextNode, GenericProp, PropsMap, SelectionState } from '../../types';

/**
 * @private
 * Extract the activated props by name from a given contextual params.
 */
type GetPropsByParamName = (
  params: ContextNode['params'],
  name?: string
) => GenericProp | typeof OPT_OUT;

export const _getPropsByParamName: GetPropsByParamName = (params, name) => {
  const { props = null } =
    // when opt-out context
    (name === OPT_OUT && { props: OPT_OUT }) ||
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
type GetPropsMap = (contextNodes: ContextNode[], selectionState: SelectionState) => PropsMap;

export const getPropsMap: GetPropsMap = (contextNodes, selectionState) =>
  contextNodes.reduce((agg, { nodeId, params }) => {
    agg[nodeId] = _getPropsByParamName(params, selectionState[nodeId]);
    return agg;
  }, Object());
