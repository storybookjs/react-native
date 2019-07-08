import { start } from '@storybook/core/client';

import './globals';
import render from './render';

export type StoriesOfArgs = [string, typeof module];

export type LoadFnArgs = [RequireContext, typeof module, string];

export interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
}

const { load: coreLoad, clientApi, configApi, forceReRender } = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'html';
export const storiesOf = (...args: StoriesOfArgs) =>
  clientApi.storiesOf(...args).addParameters({ framework });
export const load = (...args: LoadFnArgs) => coreLoad(...args, framework);

export const { configure } = configApi;
export { forceReRender };
