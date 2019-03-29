import { createElement as h, Fragment } from 'react';
import addons, { makeDecorator } from '@storybook/addons';
import { AddonWrapper } from './containers/AddonWrapper';
import { ID, PARAM } from './libs/constants';
import { WrapperSettings } from './libs/types';

export const withContexts = makeDecorator({
  name: ID,
  parameterName: PARAM,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context, settings: WrapperSettings) =>
    h(AddonWrapper, { channel: addons.getChannel(), settings }, (ready) => () =>
      ready ? getStory(context) : h(Fragment)
    ),
});
