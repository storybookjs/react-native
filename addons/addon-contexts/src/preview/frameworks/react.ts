import React from 'react';
import { getAddonDecorator } from '../index';
import { addonContextsAPI } from '../api';
import { Renderer } from '../../@types';

export const renderReact: Renderer = (...arg) => {
  const { getRendererFrom } = addonContextsAPI();
  return getRendererFrom(React.createElement)(...arg);
};

export const withContexts = getAddonDecorator(renderReact);

export default withContexts;
