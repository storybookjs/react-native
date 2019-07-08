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

const framework = 'marionette';
export const storiesOf = (...args) => clientApi.storiesOf(...args).addParameters({ framework });
export const load = (...args) => coreLoad(...args, framework);

export const { configure } = configApi;
export { forceReRender };
