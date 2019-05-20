/* eslint-disable no-underscore-dangle */
import { OPT_OUT } from '../../shared/constants';
import {
  AddonOptions,
  AnyFunctionReturns,
  ContextNode,
  GenericProp,
  PropsMap,
} from '../../shared/types.d';

/**
 * @private
 * Aggregate component vNodes with activated props in a descending order,
 * based on the given options in the contextual environment setup.
 *
 * @param {function} h - the associated `createElement` vNode creator from the framework
 */
type _getAggregatedWrap = <T>(
  h: AnyFunctionReturns<T>
) => (
  components: ContextNode['components'],
  props: GenericProp | typeof OPT_OUT,
  options: AddonOptions
) => AnyFunctionReturns<T>;

export const _getAggregatedWrap: _getAggregatedWrap = h => (
  components,
  props,
  options
) => vNode => {
  const last = components.length - 1;
  const isSkipped =
    // when set to disable
    options.disable ||
    // when opt-out context
    (options.cancelable && props === OPT_OUT);

  return isSkipped
    ? vNode
    : components
        // shallow clone the array since .reverse() is not pure
        .concat()
        // reverse the array to get the correct wrapping sequence (i.e. left(right))
        .reverse()
        .reduce((acc, C, index) => h(C, options.deep || index === last ? props : null, acc), vNode);
};

/**
 * @nosideeffects
 * Aggregate aggregated-components among all contextual nodes in a descending order;
 * this is the core of this addon, which is based on the general virtual DOM implementation.
 *
 * @param {function} h - the associated `createElement` vNode creator from the framework
 */
type getRendererFrom = <T>(
  h: AnyFunctionReturns<T>
) => (contextNodes: ContextNode[], propsMap: PropsMap, getStoryVNode: AnyFunctionReturns<T>) => T;

export const getRendererFrom: getRendererFrom = h => (contextNodes, propsMap, getStoryVNode) =>
  contextNodes
    // map over contextual nodes to get the wrapping function
    .map(({ nodeId, components, options }) =>
      _getAggregatedWrap(h)(components, propsMap[nodeId], options)
    )
    // reverse the array to get the correct wrapping sequence (i.e. top(down))
    .reverse()
    // stitch everything to get the final vNode
    .reduce((vNode, wrap) => wrap(vNode), getStoryVNode());
