import deprecate from 'util-deprecate';

// NOTE export these to keep backwards compatibility
import { action as deprecatedAction } from '@storybook/addon-actions';
import { linkTo as deprecatedLinkTo } from '@storybook/addon-links';

import Preview from './preview';

const preview = new Preview();

export const storiesOf = preview.storiesOf.bind(preview);
export const setAddon = preview.setAddon.bind(preview);
export const addDecorator = preview.addDecorator.bind(preview);
export const configure = preview.configure.bind(preview);
export const getStorybook = preview.getStorybook.bind(preview);
export const getStorybookUI = preview.getStorybookUI.bind(preview);

export const action = deprecate(
  deprecatedAction,
  '@storybook/react action is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/actions'
);

export const linkTo = deprecate(
  deprecatedLinkTo,
  '@storybook/react linkTo is deprecated. See: https://github.com/storybooks/storybook/tree/master/addons/links'
);
