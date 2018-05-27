/* eslint-disable no-underscore-dangle */
import { window } from 'global';

if (window.parent !== window) {
  try {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__VUE_DEVTOOLS_GLOBAL_HOOK__;
    window.parent.__VUE_DEVTOOLS_CONTEXT__ = window.document;
  } catch (error) {
    // The above lines can throw if we do not have access to the parent frame -- i.e. cross origin
  }
}

window.STORYBOOK_REACT_CLASSES = {};
window.STORYBOOK_ENV = 'vue';
