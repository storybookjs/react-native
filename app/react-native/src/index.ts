/* eslint-disable prefer-destructuring */
import { ClientApi } from '@storybook/client-api';
import Preview from './preview';

const preview = new Preview();

const rawStoriesOf: ClientApi['storiesOf'] = preview.api().storiesOf.bind(preview);
export const setAddon: ClientApi['setAddon'] = preview.api().setAddon.bind(preview);
export const addDecorator: ClientApi['addDecorator'] = preview.api().addDecorator.bind(preview);
export const addParameters: ClientApi['addParameters'] = preview.api().addParameters.bind(preview);
export const clearDecorators: ClientApi['clearDecorators'] = preview
  .api()
  .clearDecorators.bind(preview);
export const configure = preview.configure;
export const getStorybook: ClientApi['getStorybook'] = preview.api().getStorybook.bind(preview);
export const getStorybookUI = preview.getStorybookUI;
export const raw: ClientApi['raw'] = preview.api().raw.bind(preview);

export const storiesOf = (kind: string, module: NodeModule) =>
  rawStoriesOf(kind, module).addParameters({ framework: 'react-native' });
