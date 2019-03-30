import { createElement as h } from 'react';
import {
  GetNodes,
  MergeSettings,
  RenderAggregatedComponents,
  RenderAggregatedContexts,
} from '../@types';

export const renderAggregatedComponents: RenderAggregatedComponents = (
  components,
  props,
  options,
  last
) => (next: Function) =>
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

export const renderAggregatedContexts: RenderAggregatedContexts = (nodes, propsTree) => (next) =>
  nodes
    .map(({ nodeId, components = [], options = {} }) =>
      renderAggregatedComponents(components, propsTree[nodeId], options, components.length - 1)
    )
    .reduce((acc, agg) => agg(() => acc), next());

export const mergeSettings: MergeSettings = (
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

export const getNodes: GetNodes = ({ options = [], parameters = [] }) => {
  const titleSet = new Set(options.concat(parameters).map(({ title }) => title));
  return Array.from(titleSet)
    .filter(Boolean)
    .map((title) =>
      mergeSettings(
        options.find((option) => option.title === title) || {},
        parameters.find((param) => param.title === title) || {}
      )
    );
};
