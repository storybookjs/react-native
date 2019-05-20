import { start } from '@storybook/core/client';
import Vue from 'vue';

import './globals';
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

function decorateStory(getStory, decorators) {
  return decorators.reduce(
    (decorated, decorator) => (context = {}) => {
      let story;

      const decoratedStory = decorator((p = {}) => {
        story = decorated(
          Object.assign(
            context,
            p,
            { parameters: Object.assign(context.parameters || {}, p.parameters) },
            { options: Object.assign(context.options || {}, p.options) }
          )
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

const { clientApi, configApi, forceReRender } = start(render, { decorateStory });

export const {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

export const { configure } = configApi;
export { forceReRender };
