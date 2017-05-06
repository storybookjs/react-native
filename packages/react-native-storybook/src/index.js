import Preview from './preview';

const preview = new Preview();

export const storiesOf = preview.storiesOf.bind(preview);
export const setAddon = preview.setAddon.bind(preview);
export const addDecorator = preview.addDecorator.bind(preview);
export const configure = preview.configure.bind(preview);
export const getStorybook = preview.getStorybook.bind(preview);
export const getStorybookUI = preview.getStorybookUI.bind(preview);

// NOTE export these to keep backwards compatibility
export { action } from '@storybook/storybook-addon-actions';
export { linkTo } from '@storybook/storybook-addon-links';
