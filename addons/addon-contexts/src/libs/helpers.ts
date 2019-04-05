import {
  Memorize,
  GetContextNodes,
  MergeSettings,
  AggregateComponents,
  AggregateContexts,
} from '../@types';

/**
 * @private
 * Memorizes the calculated result of a function by an ES6 Map;
 * @return the memorized version of a function.
 */
export const _memorize: Memorize = (fn, resolver) => {
  const memo = new Map();
  return (...arg) => {
    const key = (resolver && resolver(...arg)) || arg[0];
    return memo.get(key) || memo.set(key, fn(...arg)).get(key);
  };
};

/**
 * @private
 * Merges the global (options) and the local (parameters) from a pair of setting;
 * @return the normalized definition for a contextual environment (-> node).
 */
export const _mergeSettings: MergeSettings = (
  { icon = '', title = '', components = [], params = [], options = {} },
  { params: storyParams = [], options: storyOptions = {} }
) => ({
  nodeId: title,
  icon: icon,
  title: title,
  components: components,
  params: !!(params.length || storyParams.length)
    ? params.concat(storyParams)
    : [{ name: '', props: {} }],
  options: Object.assign(
    {
      deep: false,
      disable: false,
      cancelable: false,
    },
    options,
    storyOptions
  ),
});

/**
 * @private
 * pairs up settings for merging normalizations to produce the contextual definitions (-> nodes);
 * it guarantee the adding order can be respected but not duplicated.
 */
export const _getContextNodes: GetContextNodes = ({ options, parameters }) => {
  const titles = Array()
    .concat(options, parameters)
    .map(({ title } = {}) => title);
  return [...new Set(titles)]
    .filter(Boolean)
    .map((title) =>
      _mergeSettings(
        (options && options.find((option) => option.title === title)) || {},
        (parameters && parameters.find((param) => param.title === title)) || {}
      )
    );
};

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
export const aggregateContexts: AggregateContexts = (h) => (nodes, propsMap) => (next) =>
  nodes
    .map(({ nodeId, components = [], options = {} }) =>
      _aggregateComponents(h)(components, propsMap[nodeId], options, components.length - 1)
    )
    .reduce((acc, agg) => agg(() => acc), next());

export const getNodes = _memorize(_getContextNodes, ({ parameters }) => parameters);
