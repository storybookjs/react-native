import { StoryApi } from '@storybook/addons';
import { ClientApi } from '@storybook/client-api';
import { ReactNode } from 'react';

import { start } from './preview/start';
import type { ReactNativeFramework } from './types/types-6.0';

const { clientApi, configure, view } = start();
export { configure };

type C = ClientApi<ReactNativeFramework>;

const rawStoriesOf: C['storiesOf'] = clientApi.storiesOf.bind(clientApi);
export const setAddon: C['setAddon'] = clientApi.setAddon.bind(clientApi);
export const addDecorator: C['addDecorator'] = clientApi.addDecorator.bind(clientApi);
export const addParameters: C['addParameters'] = clientApi.addParameters.bind(clientApi);
export const addArgsEnhancer: C['addArgsEnhancer'] = clientApi.addArgsEnhancer.bind(clientApi);
export const clearDecorators: C['clearDecorators'] = clientApi.clearDecorators.bind(clientApi);
export const getStorybook: C['getStorybook'] = clientApi.getStorybook.bind(clientApi);
export const raw: C['raw'] = clientApi.raw.bind(clientApi);

export const storiesOf = (kind: string, _module: NodeModule) =>
  rawStoriesOf(kind).addParameters({ framework: 'react-native' }) as StoryApi<ReactNode>;

export const getStorybookUI = view.getStorybookUI;

export * from './types/types-6.0';
