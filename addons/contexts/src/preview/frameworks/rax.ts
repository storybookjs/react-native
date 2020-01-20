import { createElement, RaxElement } from 'rax';
import { createAddonDecorator, Render } from '../../index';
import { ContextsPreviewAPI } from '../ContextsPreviewAPI';

/**
 * This is the framework specific bindings for Rax.
 * '@storybook/rax' expects the returning object from a decorator to be a 'Rax Element' (vNode).
 */
export const renderRax: Render<RaxElement<any>> = (contextNodes, propsMap, getStoryVNode) => {
  const { getRendererFrom } = ContextsPreviewAPI();
  return getRendererFrom(createElement)(contextNodes, propsMap, getStoryVNode);
};

export const withContexts = createAddonDecorator(renderRax);
