import { createElement as h } from 'react';

export const renderAggregatedComponents = (components, props, disable, cancelable, deep, last) => (
  next
) =>
  // when set to disable
  disable ||
  // when opt-out context
  props === null ||
  // when get uninitialized props but set to non-cancelable (i.e. props is required)
  (props === undefined && !cancelable)
    ? next()
    : components
        .reverse()
        .reduce((acc, C, index) => h(C, deep || index === last ? props : null, acc), next());

export const renderAggregatedContexts = (contextNodes, propsTree = {}) => (next) =>
  contextNodes
    .map(({ nodeId, components = [], options = {} }) =>
      renderAggregatedComponents(
        components,
        propsTree[nodeId],
        options.disable,
        options.cancelable,
        options.deep,
        components.length - 1
      )
    )
    .reduce((acc, agg) => agg(() => acc), next());

export const mergeSettings = (
  { icon = '', title = '', components = [], params = [], options = {} },
  { params: additionalParams = [], options: localOptions = {} }
) => ({
  nodeId: title,
  icon: icon,
  title: title,
  components: components,
  params: params.concat(additionalParams),
  options: Object.assign(
    {
      deep: false,
      disable: false,
      cancelable: false,
    },
    options,
    localOptions
  ),
});

export const getNodes = ({ options = [], parameters = [] }) => {
  const titleSet = new Set(options.concat(parameters).map(({ title } = {}) => title));
  return Array.from(titleSet)
    .filter(Boolean)
    .map((title) =>
      mergeSettings(
        options.find((option) => option.title === title) || {},
        parameters.find((param) => param.title === title) || {}
      )
    );
};
