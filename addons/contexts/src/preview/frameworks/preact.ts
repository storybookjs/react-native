import Preact from 'preact';
import { createAddonDecorator, Render } from '../../index';
import { ContextsPreviewAPI } from '../ContextsPreviewAPI';

/**
 * This is the framework specific bindings for Preact.
 * '@storybook/preact' expects the returning object from a decorator to be a 'Preact vNode'.
 */
export const renderPreact: Render<Preact.VNode> = (contextNodes, propsMap, getStoryVNode) => {
  const { getRendererFrom } = ContextsPreviewAPI();
  return getRendererFrom(Preact.h)(contextNodes, propsMap, getStoryVNode);
};

export const withContexts = createAddonDecorator(renderPreact);
