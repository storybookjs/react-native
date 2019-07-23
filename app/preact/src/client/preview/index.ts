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
export const {
  addDecorator,
  addParameters,
  clearDecorators,
  setAddon,
  getStorybook,
  raw,
}: Pick<
  ClientApi,
  'addDecorator' | 'addParameters' | 'clearDecorators' | 'setAddon' | 'getStorybook' | 'raw'
> = clientApi;
export const { configure }: Pick<ClientApi, 'configure'> = configApi;
export const { forceReRender }: Pick<ClientApi, 'forceReRender'> = api;
