import { makeDecorator, StoryGetter, StoryContext } from '@storybook/addons';
import deprecate from 'util-deprecate';

const withViewport = makeDecorator({
  name: 'withViewport',
  parameterName: 'viewport',
  wrapper: deprecate(
    (getStory: StoryGetter, context: StoryContext) => getStory(context),
    'withViewport is no longer supported, use .addParameters({ viewport }) instead'
  ),
});

export default withViewport;
