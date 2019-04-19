import React from 'react';
import { createAddonDecorator } from '../index';
import { addonContextsAPI } from '../api';
import { Renderer } from '../../@types';

/**
 * This is the framework specific bindings for React.
 * '@storybook/react' expects the returning object from a decorator to be a 'React Element' (vNode).
 */
export const renderReact: Renderer = (nodes, props, next) => {
  const { getRendererFrom } = addonContextsAPI();
  return getRendererFrom(React.createElement)(nodes, props, next);
};

export const withContexts = createAddonDecorator(renderReact);
