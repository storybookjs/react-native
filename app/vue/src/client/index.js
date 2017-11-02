// import deprecate from 'util-deprecate';

// NOTE export these to keep backwards compatibility
// import { action as deprecatedAction } from '@storybook/addon-actions';
// import { linkTo as deprecatedLinkTo } from '@storybook/addon-links';

export { storiesOf, setAddon, addDecorator, configure, getStorybook } from './preview';

// export const action = deprecate(
//   deprecatedAction,
//   '@storybook/react action is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/actions'
// );

// export const linkTo = deprecate(
//   deprecatedLinkTo,
//   '@storybook/react linkTo is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/links'
// );
