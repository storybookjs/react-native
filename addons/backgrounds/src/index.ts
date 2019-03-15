import { makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import deprecate from 'util-deprecate';

// This decorator is kept purely so we produce a decorator that is compatible with both
// `addDecorator(withBackgrounds(...))` and `addDecorator(withBackgrounds)`
export const withBackgrounds = deprecate(
  makeDecorator({
    name: 'withBackgrounds',
    parameterName: 'backgrounds',
    wrapper: (getStory: StoryGetter, context: StoryContext) => {
      return getStory(context);
    },
  }),
  `Note that withBackgrounds(options) has been replaced by addParameters({ backgrounds: options})
Read more about it in the migration guide: https://github.com/storybooks/storybook/blob/master/MIGRATION.md`
);

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
