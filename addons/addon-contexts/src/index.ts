import { createElement as h, Fragment } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { AddonWrapper } from './containers/AddonWrapper';
import { ID, PARAM } from './libs/constants';
import { WithContexts, Wrapper } from './@types';

const wrapper: Wrapper = (getStory, context, settings) =>
  h(AddonWrapper, {
    settings,
    channel: addons.getChannel(),
    children: (ready: boolean) => () => (ready ? getStory(context) : h(Fragment)),
  });

export const withContexts: WithContexts = makeDecorator({
  name: ID,
  parameterName: PARAM,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper,
});
