import { start } from '@storybook/core/client';

import './globals';
import render from './render';

// const createWrapperComponent = Target => ({
//   functional: true,
//   render(h, c) {
//     return h(Target, c.data, c.children);
//   },
// });

const { clientApi, configApi, forceReRender } = start(render);
// const { clientApi, configApi, forceReRender } = start(render, { decorateStory });

export const {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
} = clientApi;

export const { configure } = configApi;
export { forceReRender };
