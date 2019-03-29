import { createElement as h, Fragment } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { AddonWrapper } from './containers/AddonWrapper';
import { ID, PARAM } from './libs/constants';

export const withContexts = makeDecorator({
  name: ID,
  parameterName: PARAM,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context, settings) =>
    h(AddonWrapper, { channel: addons.getChannel(), settings }, (ready) => () =>
      ready ? getStory(context) : h(Fragment)
    ),
});
