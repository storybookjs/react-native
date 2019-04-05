import { createElement as h } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { ReactWrapper } from './containers/ReactWrapper';
import { ID, PARAM } from './libs/constants';
import { getContextNodes } from './libs/helpers';
import { WithContexts, Wrapper } from './@types';

const wrapper: Wrapper = (getStory, context, settings) => {
  const nodes = getContextNodes(settings);
  return h(ReactWrapper, {
    nodes,
    channel: addons.getChannel(),
    children: (ready: boolean) => () => (ready ? getStory(context) : h('div')),
  });
};

export const withContexts: WithContexts = makeDecorator({
  name: ID,
  parameterName: PARAM,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper,
});
