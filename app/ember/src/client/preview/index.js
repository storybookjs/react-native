import { start } from '@storybook/core/client';

import './globals';
import render from './render';

const { configure: coreConfigure, clientApi, forceReRender } = start(render);

export const { setAddon, addParameters, clearDecorators, getStorybook, raw } = clientApi;

const framework = 'ember';
export const storiesOf = (...args) => clientApi.storiesOf(...args).addParameters({ framework });
export const configure = (...args) => coreConfigure(...args, framework);
export const addDecorator = decorator => clientApi.addDecorator(decorator, framework);

export { forceReRender };
