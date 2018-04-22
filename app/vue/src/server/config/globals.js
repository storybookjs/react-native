/* eslint-disable no-underscore-dangle */
import { window } from 'global';

if (window.parent !== window) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  window.parent.__VUE_DEVTOOLS_CONTEXT__ = window.document;
}

window.STORYBOOK_REACT_CLASSES = {};
window.STORYBOOK_ENV = 'vue';
