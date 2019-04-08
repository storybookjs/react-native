import { createElement } from 'react';
import { addonContextsAPI } from './api';
import { Wrapper } from '../@types';

export const reactWrapper: Wrapper = (getStory, content, settings) => {
  const { getContextNodes, getSelectionState, getPropsMap, getRenderFrom } = addonContextsAPI();
  const nodes = getContextNodes(settings);
  const state = getSelectionState();
  const props = getPropsMap(nodes, state);
  const render = getRenderFrom(createElement);
  return render(nodes, props, () => getStory(content));
};
