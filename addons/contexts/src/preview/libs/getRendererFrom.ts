import { GetAggregatedWrap, GetRendererFrom } from '../../@types';

/**
 * @private
 * Aggregates component vNodes with activated props in a descending order,
 * based on the given options in the contextual environment setup.
 *
 * @param {function} h - the associated `createElement` vNode creator from the framework
 */
export const _getAggregatedWrap: GetAggregatedWrap = h => (components, props, options) => vNode => {
  const last = components.length - 1;
  const isSkipped =
    // when set to disable
    options.disable ||
    // when opt-out context
    props === null ||
    // when get uninitialized props but set to non-cancelable (i.e. props is required)
    (props === undefined && !options.cancelable);

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
export const getRendererFrom: GetRendererFrom = h => (nodes, propsMap, getStoryVNode) =>
  nodes
    // map over contextual nodes to get the wrapping function
    .map(({ nodeId, components, options }) =>
      _getAggregatedWrap(h)(components, propsMap[nodeId], options)
    )
    // reverse the array to get the correct wrapping sequence (i.e. top(down))
    .reverse()
    // stitch everything to get the final vNode
    .reduce((vNode, wrap) => wrap(vNode), getStoryVNode());
