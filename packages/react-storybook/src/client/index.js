import * as previewApi from './preview';

export const storiesOf = previewApi.storiesOf;
export const setAddon = previewApi.setAddon;
export const addDecorator = previewApi.addDecorator;
export const configure = previewApi.configure;
export const getStorybook = previewApi.getStorybook;

// NOTE export these to keep backwards compatibility
export { action } from '@kadira/storybook-addon-actions';
export { linkTo } from '@kadira/storybook-addon-links';
