import { start } from '@storybook/core/client';
import { ClientApi } from './types';

import './globals';
import render from './render';

const api = start(render);
const { load: coreLoad, clientApi, configApi } = api;
const framework = 'preact';

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};
export const load: ClientApi['load'] = (...args: any) => coreLoad(...args, framework);
export const addDecorator: ClientApi['addDecorator'] = clientApi.addDecorator;
export const addParameters: ClientApi['addParameters'] = clientApi.addParameters;
export const clearDecorators: ClientApi['clearDecorators'] = clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = clientApi.setAddon;
export const configure: ClientApi['configure'] = configApi.configure;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = clientApi.getStorybook;
export const raw: ClientApi['raw'] = clientApi.raw;
