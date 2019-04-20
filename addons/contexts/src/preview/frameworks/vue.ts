import Vue, { Component } from 'vue';
import { createAddonDecorator, Renderer } from '../index';
import { addonContextsAPI } from '../api';
import { ID } from '../../constants';

/**
 * This is the framework specific bindings for Vue.
 * '@storybook/vue' expects the returning object from a decorator to be a 'VueComponent'.
 */
export const renderVue: Renderer = (contextNodes, propsMap, getStoryVNode) => {
  const { getRendererFrom, updateReactiveSystem } = addonContextsAPI();
  const reactiveProps = updateReactiveSystem(propsMap);
  return Vue.extend({
    name: ID,
    data: () => reactiveProps,
    render: createElement =>
      getRendererFrom((component, props, children) =>
        createElement(component, { props }, [children])
      )(contextNodes, reactiveProps, () => createElement(getStoryVNode() as Component)),
  });
};

export const withContexts = createAddonDecorator(renderVue);
