import Vue from 'vue';
import { createAddonDecorator, Render } from '../../index';
import { ContextsPreviewAPI } from '../ContextsPreviewAPI';
import { ID } from '../../shared/constants';

/**
 * This is the framework specific bindings for Vue.
 * '@storybook/vue' expects the returning object from a decorator to be a 'VueComponent'.
 */
export const renderVue: Render<Vue.Component> = (contextNodes, propsMap, getStoryComponent) => {
  const { getRendererFrom, updateReactiveSystem } = ContextsPreviewAPI();
  const reactiveProps = updateReactiveSystem(propsMap);
  return Vue.extend({
    name: ID,
    data: () => reactiveProps,
    render: createElement =>
      getRendererFrom((Component, props, children) => {
        const { key, ref, style, classNames, ...rest } = props || Object();
        const contextData =
          Component instanceof Object
            ? { key, ref, style, class: classNames, props: rest } // component as a Vue object
            : { key, ref, style, class: classNames, attrs: rest }; // component as a HTML tag string
        return createElement(Component, contextData, [children]);
      })(contextNodes, reactiveProps, () => createElement(getStoryComponent())),
  });
};

export const withContexts = createAddonDecorator(renderVue);
