/* eslint-disable no-underscore-dangle */
/* global window */

export {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  configure,
  getStorybook,
  forceReRender,
  raw,
} from './preview';

/**
 * @param customElements any for now as spec is not super stable yet
 */
export function setCustomElements(customElements: any) {
  // @ts-ignore
  window.__STORYBOOK_CUSTOM_ELEMENTS__ = customElements;
}

export function getCustomElements() {
  // @ts-ignore
  return window.__STORYBOOK_CUSTOM_ELEMENTS__;
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// TODO: disable HMR and do full page loads because of customElements.define
