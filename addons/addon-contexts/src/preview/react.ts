import { createElement as h } from 'react';
import { addonContextsAPI } from './api';
import { Wrapper } from '../@types';

export const reactWrapper: Wrapper = (getStory, context, settings) => {
  const { aggregate, getContextNodes, getSelectionState, getPropsMap } = addonContextsAPI();
  const nodes = getContextNodes(settings);
  const state = getSelectionState();
  const propsMap = getPropsMap(nodes, state);
  const loadStory = () => getStory(context);
  return aggregate(h)(nodes, propsMap, loadStory);
};
