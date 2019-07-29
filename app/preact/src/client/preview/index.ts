import { start } from '@storybook/core/client';

import './globals';
import render from './render';
import { ClientApi } from './types';

const framework = 'preact';
const api = start(render);

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};
export const configure: ClientApi['configure'] = (...args) => api.configure(...args, framework);
export const { addDecorator } = api.clientApi;
export const { addParameters } = api.clientApi;
export const { clearDecorators } = api.clientApi;
export const { setAddon } = api.clientApi;
export const { forceReRender } = api;
export const { getStorybook } = api.clientApi;
export const { raw } = api.clientApi;
