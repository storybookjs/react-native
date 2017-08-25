// import deprecate from 'util-deprecate';

// NOTE export these to keep backwards compatibility
// import { action as deprecatedAction } from '@storybook/addon-actions';
// import { linkTo as deprecatedLinkTo } from '@storybook/addon-links';

import * as previewApi from './preview';

export const storiesOf = previewApi.storiesOf;
export const setAddon = previewApi.setAddon;
export const addDecorator = previewApi.addDecorator;
export const configure = previewApi.configure;
export const getStorybook = previewApi.getStorybook;

// export const action = deprecate(
//   deprecatedAction,
//   '@storybook/react action is deprecated. See: https://github.com/storybooks/storybook/tree/master/addon/actions'
// );

// export const linkTo = deprecate(
//   deprecatedLinkTo,
//   '@storybook/react linkTo is deprecated. See: https://github.com/storybooks/storybook/tree/master/addon/links'
// );
