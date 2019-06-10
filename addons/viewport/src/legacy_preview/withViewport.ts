import { makeDecorator } from '@storybook/addons';
import deprecate from 'util-deprecate';

const withViewport = makeDecorator({
  name: 'withViewport',
  parameterName: 'viewport',
  wrapper: deprecate(
    (getStory: any, context: any) => getStory(context),
    'withViewport is no longer supported, use .addParameters({ viewport }) instead'
  ),
});

export default withViewport;
