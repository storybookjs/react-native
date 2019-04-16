import { OPT_OUT } from '../../constants';
import { ContextNode, GetPropsByParamName, GetPropsMap } from '../../@types';

/**
 * @private
 * get the activated props by name from a given contextual params.
 */
export const _getPropsByParamName: GetPropsByParamName = (params = [], name) => {
  const { props = null } =
    // when opt-out context
    (name === OPT_OUT && {}) ||
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
 * construct propsMap from Nodes based on a controlled state tracker.
 */
export const getPropsMap: GetPropsMap = (nodes: ContextNode[], state) =>
  nodes.reduce((agg, { nodeId, params }) => {
    agg[nodeId] = _getPropsByParamName(params, state[nodeId]);
    return agg;
  }, Object());
