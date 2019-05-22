import { makeDecorator, StoryWrapper } from '@storybook/addons';
import { ContextsPreviewAPI } from './preview/ContextsPreviewAPI';
import { ID, PARAM } from './shared/constants';
import { AddonSetting, AnyFunctionReturns, ContextNode, PropsMap } from './shared/types.d';

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
 * @param {Render} render - framework specific bindings
 */
export type Render<T> = (...args: [ContextNode[], PropsMap, AnyFunctionReturns<T>]) => T;
type CreateAddonDecorator = <T>(render: Render<T>) => (contexts: AddonSetting[]) => unknown;

export const createAddonDecorator: CreateAddonDecorator = render => {
  const wrapper: StoryWrapper = (getStory, context, settings: any) => {
    const { getContextNodes, getSelectionState, getPropsMap } = ContextsPreviewAPI();
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
