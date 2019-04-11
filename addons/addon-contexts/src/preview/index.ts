import { makeDecorator } from '@storybook/addons';
import { addonContextsAPI } from './api';
import { ID, PARAM } from '../constants';
import { GetAddonDecorator, Wrapper } from '../@types';

export const getAddonDecorator: GetAddonDecorator = (render) => {
  const wrapper: Wrapper = (getStory, context, settings) => {
    const { getContextNodes, getSelectionState, getPropsMap } = addonContextsAPI();
    const nodes = getContextNodes(settings);
    const state = getSelectionState();
    const props = getPropsMap(nodes, state);
    return render(nodes, props, () => getStory(context));
  };

  return makeDecorator({
    name: ID,
    parameterName: PARAM,
    skipIfNoParametersOrOptions: true,
    allowDeprecatedUsage: false,
    wrapper,
  });
};
