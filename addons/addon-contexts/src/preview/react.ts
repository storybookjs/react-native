import { createElement as h } from 'react';
import { addonContextsAPI } from './api';
import { Wrapper } from '../@types';

export const reactWrapper: Wrapper = (getStory, content, settings) => {
  const { getContextNodes, getSelectionState, getPropsMap, renderInContexts } = addonContextsAPI();
  const nodes = getContextNodes(settings);
  const state = getSelectionState();
  const props = getPropsMap(nodes, state);
  const render = renderInContexts(h);
  return render(nodes, props, () => getStory(content));
};
