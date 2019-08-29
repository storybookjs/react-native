/* eslint no-underscore-dangle: 0 */
import deprecate from 'util-deprecate';
import isPlainObject from 'is-plain-object';
import { logger } from '@storybook/client-logger';
import addons, { StoryContext, StoryFn, Parameters, OptionsParameter } from '@storybook/addons';
import Events from '@storybook/core-events';
import { toId } from '@storybook/router/utils';

import mergeWith from 'lodash/mergeWith';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { ClientApiParams, DecoratorFunction, ClientApiAddons, StoryApi } from './types';
import subscriptionsStore from './subscriptions_store';
import { applyHooks } from './hooks';
import StoryStore from './story_store';

// merge with concatenating arrays, but no duplicates
const merge = (a: any, b: any) =>
  mergeWith({}, a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(
    (decorated, decorator) => (context: StoryContext = defaultContext) =>
      decorator(
        p =>
          decorated(
            p
              ? {
                  ...context,
                  ...p,
                  parameters: { ...context.parameters, ...p.parameters },
                }
              : context
          ),
        context
      ),
    storyFn
  );

const metaSubscriptionHandler = deprecate(
  subscriptionsStore.register,
  'Events.REGISTER_SUBSCRIPTION is deprecated and will be removed in 6.0. Please use useEffect from @storybook/client-api instead.'
);

const metaSubscription = () => {
  addons.getChannel().on(Events.REGISTER_SUBSCRIPTION, metaSubscriptionHandler);
  return () =>
    addons.getChannel().removeListener(Events.REGISTER_SUBSCRIPTION, metaSubscriptionHandler);
};

const withSubscriptionTracking = (storyFn: StoryFn) => {
  if (!addons.hasChannel()) {
    return storyFn();
  }
  subscriptionsStore.markAllAsUnused();
  subscriptionsStore.register(metaSubscription);
  const result = storyFn();
  subscriptionsStore.clearUnused();
  return result;
};

export default class ClientApi {
  private _storyStore: StoryStore;

  private _addons: ClientApiAddons<unknown>;

  private _globalDecorators: DecoratorFunction[];

  private _globalParameters: Parameters;

  private _decorateStory: (storyFn: StoryFn, decorators: DecoratorFunction[]) => any;

  constructor({ storyStore, decorateStory = defaultDecorateStory }: ClientApiParams) {
    this._storyStore = storyStore;
    this._addons = {};

    this._globalDecorators = [];
    this._globalParameters = {};
    this._decorateStory = decorateStory;

    if (!storyStore) {
      throw new Error('storyStore is required');
    }
  }

  setAddon = (addon: any) => {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  };

  getSeparators = () =>
    Object.assign(
      {},
      {
        hierarchyRootSeparator: '|',
        hierarchySeparator: /\/|\./,
      },
      this._globalParameters.options
    );

  addDecorator = (decorator: DecoratorFunction) => {
    this._globalDecorators.push(decorator);
  };

  addParameters = (parameters: Parameters | { globalParameter: 'string' }) => {
    this._globalParameters = {
      ...this._globalParameters,
      ...parameters,
      options: {
        ...merge(get(this._globalParameters, 'options', {}), get(parameters, 'options', {})),
      },
      // FIXME: https://github.com/storybookjs/storybook/issues/7872
      docs: {
        ...merge(get(this._globalParameters, 'docs', {}), get(parameters, 'docs', {})),
      },
    };
  };

  clearDecorators = () => {
    this._globalDecorators = [];
  };

  // what are the occasions that "m" is simply a boolean, vs an obj
  storiesOf = <StoryFnReturnType = unknown>(
    kind: string,
    m: NodeModule
  ): StoryApi<StoryFnReturnType> => {
    if (!kind && typeof kind !== 'string') {
      throw new Error('Invalid or missing kind provided for stories, should be a string');
    }

    if (!m) {
      logger.warn(
        `Missing 'module' parameter for story with a kind of '${kind}'. It will break your HMR`
      );
    }

    if (m && m.hot && m.hot.dispose) {
      m.hot.dispose(() => {
        const { _storyStore } = this;
        _storyStore.removeStoryKind(kind);
        _storyStore.incrementRevision();
      });
    }

    const localDecorators: DecoratorFunction<StoryFnReturnType>[] = [];
    let localParameters: Parameters = {};
    let hasAdded = false;
    const api: StoryApi<StoryFnReturnType> = {
      kind: kind.toString(),
      add: () => api,
      addDecorator: () => api,
      addParameters: () => api,
    };

    // apply addons
    Object.keys(this._addons).forEach(name => {
      const addon = this._addons[name];
      api[name] = (...args: any[]) => {
        addon.apply(api, args);
        return api;
      };
    });

    api.add = (storyName, storyFn, parameters) => {
      hasAdded = true;
      const { _globalParameters, _globalDecorators } = this;

      const id = toId(kind, storyName);

      if (typeof storyName !== 'string') {
        throw new Error(`Invalid or missing storyName provided for a "${kind}" story.`);
      }
      if (m && m.hot && m.hot.dispose) {
        m.hot.dispose(() => {
          const { _storyStore } = this;
          _storyStore.remove(id);
        });
      }

      const fileName = m && m.id ? `${m.id}` : undefined;

      const { hierarchyRootSeparator, hierarchySeparator } = this.getSeparators();
      const baseOptions: OptionsParameter = {
        hierarchyRootSeparator,
        hierarchySeparator,
      };
      const allParam = [
        { options: baseOptions },
        _globalParameters,
        localParameters,
        parameters,
      ].reduce(
        (acc: Parameters, p) => {
          if (p) {
            Object.entries(p).forEach(([key, value]) => {
              const existingValue = acc[key];

              if (Array.isArray(value)) {
                acc[key] = value;
              } else if (isPlainObject(value) && isPlainObject(existingValue)) {
                acc[key] = merge(existingValue, value);
              } else {
                acc[key] = value;
              }
            });
          }
          return acc;
        },
        { fileName }
      );

      this._storyStore.addStory(
        {
          id,
          kind,
          name: storyName,
          storyFn,
          parameters: allParam,
        },
        {
          applyDecorators: applyHooks(this._decorateStory),
          getDecorators: () => [
            ...(allParam.decorators || []),
            ...localDecorators,
            ..._globalDecorators,
            withSubscriptionTracking,
          ],
        }
      );
      return api;
    };

    api.addDecorator = (decorator: DecoratorFunction<StoryFnReturnType>) => {
      if (hasAdded) {
        logger.warn(`You have added a decorator to the kind '${kind}' after a story has already been added.
In Storybook 4 this applied the decorator only to subsequent stories. In Storybook 5+ it applies to all stories.
This is probably not what you intended. Read more here: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md`);
      }

      localDecorators.push(decorator);
      return api;
    };

    api.addParameters = (parameters: Parameters) => {
      localParameters = { ...localParameters, ...parameters };
      return api;
    };

    return api;
  };

  // legacy
  getStorybook = () =>
    this._storyStore.getStoryKinds().map(kind => {
      const fileName = this._storyStore.getStoryFileName(kind);

      const stories = this._storyStore.getStories(kind).map(name => {
        const render = this._storyStore.getStoryWithContext(kind, name);
        return { name, render };
      });

      return { kind, fileName, stories };
    });

  raw = () => this._storyStore.raw();

  // FIXME: temporary expose the store for react-native
  // Longer term react-native should use the Provider/Consumer api
  store = () => this._storyStore;
}
