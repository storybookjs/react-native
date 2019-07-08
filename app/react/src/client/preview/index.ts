/* eslint-disable prefer-destructuring */
import { start } from '@storybook/core/client';
import { ClientStoryApi } from '@storybook/addons';

import './globals';
import render from './render';
import { IStorybookSection, StoryFnReactReturnType } from './types';

const framework = 'react';

interface ClientApi extends ClientStoryApi<StoryFnReactReturnType> {
  setAddon(addon: any): void;
  configure(loaders: () => void, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
  load: (...args: any[]) => void;
}

const api = start(render);

export const storiesOf: ClientApi['storiesOf'] = (kind, m) => {
  return (api.clientApi.storiesOf(kind, m) as ReturnType<ClientApi['storiesOf']>).addParameters({
    framework,
  });
};

export const load: ClientApi['load'] = (...args) => api.load(...args, framework);
export const addDecorator: ClientApi['addDecorator'] = api.clientApi.addDecorator;
export const addParameters: ClientApi['addParameters'] = api.clientApi.addParameters;
export const clearDecorators: ClientApi['clearDecorators'] = api.clientApi.clearDecorators;
export const setAddon: ClientApi['setAddon'] = api.clientApi.setAddon;
export const configure: ClientApi['configure'] = api.configApi.configure;
export const forceReRender: ClientApi['forceReRender'] = api.forceReRender;
export const getStorybook: ClientApi['getStorybook'] = api.clientApi.getStorybook;
export const raw: ClientApi['raw'] = api.clientApi.raw;
