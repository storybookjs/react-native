import { AggregateComponents, AggregateContexts } from '../../@types';

/**
 * @private
 * Aggregates components with activated props in a descending order,
 * based on the given options in the contextual environment setup.

 * @param {function} h - the associated `createElement` vNode creator from the framework
 */
export const _aggregateComponents: AggregateComponents = (h) => (
  components,
  props,
  options,
  last
) => (next) =>
  // when set to disable
  options.disable ||
  // when opt-out context
  props === null ||
  // when get uninitialized props but set to non-cancelable (i.e. props is required)
  (props === undefined && !options.cancelable)
    ? next()
    : components
        .reverse()
        .reduce(
          (acc, C, index) => h(C, options.deep || index === last ? props : null, acc),
          next()
        );

/**
 * Aggregate aggregated-components among all contextual nodes in a descending order.
 *
 * @param {function} h - the associated `createElement` vNode creator from the framework
 */
export const aggregateContexts: AggregateContexts = (h) => (nodes, propsMap, next) =>
  nodes
    .map(({ nodeId, components = [], options = {} }) =>
      _aggregateComponents(h)(components, propsMap[nodeId], options, components.length - 1)
    )
    .reduce((acc, agg) => agg(() => acc), next());
