import { makeDecorator } from '@storybook/addons';
import { ID, PARAM } from './constants';
import { wrapper } from './preview';
import { WithContexts } from './@types';

export const withContexts: WithContexts = makeDecorator({
  name: ID,
  parameterName: PARAM,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper,
});
