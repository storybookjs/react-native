/* eslint-disable prefer-destructuring */
import Vue from 'vue';
import { start } from '@storybook/core/client';
import { ClientStoryApi, StoryFn, DecoratorFunction } from '@storybook/addons';

import './globals';
import { IStorybookSection, StoryFnVueReturnType } from './types';

import render, { VALUES } from './render';
import { extractProps } from './util';

export const WRAPS = 'STORYBOOK_WRAPS';

function prepare(rawStory, innerStory) {
  let story = rawStory;
  // eslint-disable-next-line no-underscore-dangle
  if (!story._isVue) {
    if (typeof story === 'string') {
      story = { template: story };
    }
    if (innerStory) {
      story.components = { ...(story.components || {}), story: innerStory };
    }
    story = Vue.extend(story);
  } else if (story.options[WRAPS]) {
    return story;
  }

  return Vue.extend({
    [WRAPS]: story,
    [VALUES]: { ...(innerStory ? innerStory.options[VALUES] : {}), ...extractProps(story) },
    functional: true,
    render(h, { data, parent, children }) {
      return h(
        story,
        {
          ...data,
          props: { ...(data.props || {}), ...parent.$root[VALUES] },
        },
        children
      );
    },
  });
}

// (storyFn: StoryFn, decorators: DecoratorFunction[])
function decorateStory(
  storyFn: StoryFn<StoryFnVueReturnType>,
  decorators: DecoratorFunction<StoryFnVueReturnType>[]
) {
  return decorators.reduce(
    (decorated, decorator) => (context = {}) => {
      let story;

      const decoratedStory = decorator((p = {}) => {
        story = decorated(
          p
            ? {
                ...context,
                ...p,
                parameters: {
                  ...context.parameters,
                  ...p.parameters,
                },
              }
            : context
        );

        return story;
      }, context);

      if (!story) {
        story = decorated(context);
      }

      if (decoratedStory === story) {
        return story;
      }

      return prepare(decoratedStory, story);
    },
    context => prepare(getStory(context))
  );
}
const framework = 'vue';

interface ClientApi extends ClientStoryApi<StoryFnVueReturnType> {
  setAddon(addon: any): void;
  configure(loaders: () => void, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any; // todo add type
  load: (...args: any[]) => void;
}

const api = start(render, { decorateStory });

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
