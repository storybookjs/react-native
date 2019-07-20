import { start } from '@storybook/core/client';

import './globals';
import render from './render';

const { load: coreLoad, clientApi, configApi, forceReRender } = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'preact';
export const storiesOf = (...args: any) =>
  clientApi.storiesOf(...args).addParameters({ framework });
export const load = (...args: any) => coreLoad(...args, framework);

export const { configure } = configApi;
export { forceReRender };
