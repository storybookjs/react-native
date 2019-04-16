import { makeDecorator, StoryWrapper } from '@storybook/addons';
import { addonContextsAPI } from './api';
import { ID, PARAM } from '../constants';
import { CreateAddonDecorator } from '../@types';

/**
 * This file serves a idiomatic facade of a Storybook decorator.
 *
 * Wrapper function get called whenever the Storybook rerender the view.  This reflow logic is
 * framework agnostic; on the other hand, the framework specific bindings are the implementation
 * details hidden behind the passed `render` function.
 *
 * Here, we need a dedicated singleton as a state manager for preview (the addon API, in vanilla)
 * who is also knowing how to communicate with the Storybook manager (in React) via the Storybook
 * event system.
 *
 * @param render - framework specific bindings
 */
export const createAddonDecorator: CreateAddonDecorator = render => {
  const wrapper: StoryWrapper = (getStory, context, settings: any) => {
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
