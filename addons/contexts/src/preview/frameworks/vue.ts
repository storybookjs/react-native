import Vue from 'vue';
import { createAddonDecorator, Render } from '../index';
import { addonContextsAPI } from '../api';
import { ID } from '../../constants';

/**
 * This is the framework specific bindings for Vue.
 * '@storybook/vue' expects the returning object from a decorator to be a 'VueComponent'.
 */
export const renderVue: Render<Vue.Component> = (contextNodes, propsMap, getStoryVNode) => {
  const { getRendererFrom, updateReactiveSystem } = addonContextsAPI();
  const reactiveProps = updateReactiveSystem(propsMap);
  return Vue.extend({
    name: ID,
    data: () => reactiveProps,
    render: createElement =>
      getRendererFrom((component, props, children) =>
        createElement(component, { props }, [children])
      )(contextNodes, reactiveProps, () => createElement(getStoryVNode())),
  });
};

export const withContexts = createAddonDecorator(renderVue);
