import { start } from '@storybook/core/client';

import './globals';
import render from './render';

const createWrapperComponent = Target => ({
  functional: true,
  render(h, c) {
    return h(Target, c.data, c.children);
  },
});
const decorateStory = (getStory, decorators) =>
  decorators.reduce(
    (decorated, decorator) => context => {
      const story = () => decorated(context);
      let decoratedStory = decorator(story, context);

      if (typeof decoratedStory === 'string') {
        decoratedStory = { template: decoratedStory };
      }

      decoratedStory.components = decoratedStory.components || {};
      decoratedStory.components.story = createWrapperComponent(story());
      return decoratedStory;
    },
    getStory
  );

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
