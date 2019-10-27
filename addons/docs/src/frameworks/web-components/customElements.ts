/* eslint-disable no-underscore-dangle */
/* global window */

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
