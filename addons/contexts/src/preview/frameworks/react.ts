import React from 'react';
import { createAddonDecorator, Render } from '../../index';
import { ContextsPreviewAPI } from '../ContextsPreviewAPI';

/**
 * This is the framework specific bindings for React.
 * '@storybook/react' expects the returning object from a decorator to be a 'React Element' (vNode).
 */
export const renderReact: Render<React.ReactElement> = (contextNodes, propsMap, getStoryVNode) => {
  const { getRendererFrom } = ContextsPreviewAPI();
  return getRendererFrom(React.createElement)(contextNodes, propsMap, getStoryVNode);
};

export const withContexts = createAddonDecorator(renderReact);
