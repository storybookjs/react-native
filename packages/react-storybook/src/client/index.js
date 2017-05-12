import deprecate from 'util-deprecate';
import * as previewApi from './preview';

export const storiesOf = previewApi.storiesOf;
export const setAddon = previewApi.setAddon;
export const addDecorator = previewApi.addDecorator;
export const configure = previewApi.configure;
export const getStorybook = previewApi.getStorybook;

// NOTE export these to keep backwards compatibility
import { action as _action } from '@kadira/storybook-addon-actions';
import { linkTo as _linkTo } from '@kadira/storybook-addon-links';

export const action = deprecate(
  _action,
  '@kadira/storybook action is deprecated. See: https://github.com/storybooks/storybook/tree/master/packages/addon-actions',
);

export const linkTo = deprecate(
  _linkTo,
  '@kadira/storybook linkTo is deprecated. See: https://github.com/storybooks/storybook/tree/master/packages/addon-links',
);
