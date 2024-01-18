import { ClientApi } from '@storybook/preview-api';
import type { Addon_StoryApi } from '@storybook/types';
import { ReactNode } from 'react';
import { start } from './StartV6';

import type { ReactRenderer } from '@storybook/react';

const { clientApi, configure, view } = start();

export { configure };

type C = ClientApi<ReactRenderer>;

const rawStoriesOf: C['storiesOf'] = clientApi.storiesOf.bind(clientApi);

export const addDecorator: C['addDecorator'] = clientApi.addDecorator.bind(clientApi);

export const addParameters: C['addParameters'] = clientApi.addParameters.bind(clientApi);

export const addArgsEnhancer: C['addArgsEnhancer'] = clientApi.addArgsEnhancer.bind(clientApi);

export const addArgTypesEnhancer: C['addArgTypesEnhancer'] =
  clientApi.addArgTypesEnhancer.bind(clientApi);

export const raw: C['raw'] = clientApi.raw.bind(clientApi);

export const storiesOf = (kind: string, m: any) => {
  return rawStoriesOf(kind, m).addParameters({
    renderer: 'react-native',
  }) as Addon_StoryApi<ReactNode>;
};

export const getStorybookUI = view.getStorybookUI;

export * from './types';

// @storybook/addon-storyshots v6 needs global.__STORYBOOK_STORY_STORE__.initializationPromise
(global as any).__STORYBOOK_STORY_STORE__ = {
  initializationPromise: clientApi.storyStore?.initializationPromise,
};

export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';
