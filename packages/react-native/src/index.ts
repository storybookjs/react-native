import { ClientApi } from '@storybook/preview-api';
import type { Addon_StoryApi } from '@storybook/types';
import { ReactNode } from 'react';
import { start } from './preview/start';
import type { ReactNativeFramework } from './types/types-6.0';

if (__DEV__) {
  const primitiveTypes = ['string', 'number', 'boolean'];
  const logLevels = ['log', 'debug', 'info', 'warn', 'error'];

  const transformArgs = (args) => {
    return args.map((arg) => {
      if (arg === undefined) {
        return 'undefined';
      }
      if (arg instanceof Error) {
        if (arg.stack) {
          return arg.stack;
        }
        return arg.toString();
      }
      if (arg instanceof Date) {
        return arg.toString();
      }
      if (primitiveTypes.includes(typeof arg)) {
        return arg.toString();
      } else {
        return JSON.stringify(arg);
      }
    });
  };

  const consoleProxy = new Proxy(console, {
    get: (target, prop) => {
      //@ts-ignore
      if (logLevels.includes(prop)) {
        return (...args) => {
          // we proxy the call to itself, but we transform the arguments to strings before
          // so that they are printed in the terminal
          return target[prop].apply(this, transformArgs(args));
        };
      }
      return target[prop];
    },
  });

  console = consoleProxy;
}

const { clientApi, configure, view } = start();

export { configure };

type C = ClientApi<ReactNativeFramework>;

const rawStoriesOf: C['storiesOf'] = clientApi.storiesOf.bind(clientApi);

export const addDecorator: C['addDecorator'] = clientApi.addDecorator.bind(clientApi);

export const addParameters: C['addParameters'] = clientApi.addParameters.bind(clientApi);

export const addArgsEnhancer: C['addArgsEnhancer'] = clientApi.addArgsEnhancer.bind(clientApi);

export const addArgTypesEnhancer: C['addArgTypesEnhancer'] =
  clientApi.addArgTypesEnhancer.bind(clientApi);

export const raw: C['raw'] = clientApi.raw.bind(clientApi);

export const storiesOf = (kind: string, m: any) => {
  m.hot.dispose = (_cb) => {
    clientApi._loadAddedExports();
  };

  return rawStoriesOf(kind, m).addParameters({
    renderer: 'react-native',
  }) as Addon_StoryApi<ReactNode>;
};

export const getStorybookUI = view.getStorybookUI;

export * from './types/types-6.0';

// @storybook/addon-storyshots v6 needs global.__STORYBOOK_STORY_STORE__.initializationPromise
(global as any).__STORYBOOK_STORY_STORE__ = {
  initializationPromise: clientApi.storyStore?.initializationPromise,
};

export { darkTheme, theme, type Theme } from '@storybook/react-native-theming';
