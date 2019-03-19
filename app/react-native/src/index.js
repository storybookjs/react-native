import Preview from './preview';

const preview = new Preview();

export const storiesOf = preview.storiesOf.bind(preview);
export const setAddon = preview.setAddon.bind(preview);
export const addDecorator = preview.addDecorator.bind(preview);
export const addParameters = preview.addParameters.bind(preview);
export const clearDecorators = preview.clearDecorators.bind(preview);
export const configure = preview.configure.bind(preview);
export const getStorybook = preview.getStorybook.bind(preview);
export const getStorybookUI = preview.getStorybookUI.bind(preview);
export const raw = preview.raw.bind(preview);
