import React from 'react';
import { getAddonDecorator } from '../index';
import { addonContextsAPI } from '../api';
import { Renderer } from '../../@types';

export const renderReact: Renderer = (...arg) => {
  const { getRenderFrom } = addonContextsAPI();
  return getRenderFrom(React.createElement)(...arg);
};

export const withContexts = getAddonDecorator(renderReact);

export default withContexts;
