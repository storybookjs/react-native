import { makeDecorator } from '@storybook/addons';
import deprecate from 'util-deprecate';

const withViewport = deprecate(
  makeDecorator({
    name: 'withViewport',
    parameterName: 'viewports',
    allowDeprecatedUsage: true,
    wrapper: (getStory, context) => getStory(context),
  }),
  'usage is deprecated, use .addParameters({ viewport }) instead'
);

export default withViewport;

export const Viewport = deprecate(
  ({ children }) => children,
  `<Viewport> usage is deprecated, use .addParameters({ viewport }) instead`
);
