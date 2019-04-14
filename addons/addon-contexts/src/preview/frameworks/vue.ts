import Vue, { Component } from 'vue';
import { getAddonDecorator } from '../index';
import { addonContextsAPI } from '../api';
import { ID } from '../../constants';
import { Renderer } from '../../@types';

export const renderVue: Renderer = (nodes, props, next) => {
  const { getRendererFrom, updateReactiveSystem } = addonContextsAPI();
  const reactiveProps = updateReactiveSystem(props);
  return Vue.extend({
    name: ID,
    data: () => reactiveProps,
    render: (createElement) =>
      getRendererFrom((component, props, children) =>
        createElement(component, { props }, [children])
      )(nodes, reactiveProps, () => createElement(next() as Component)),
  });
};

export const withContexts = getAddonDecorator(renderVue);

export default withContexts;
