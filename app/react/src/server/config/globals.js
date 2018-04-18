import { window } from 'global';

if (window.parent !== window) {
  // eslint-disable-next-line no-underscore-dangle
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}
window.STORYBOOK_REACT_CLASSES = {};
window.STORYBOOK_ENV = 'react';
