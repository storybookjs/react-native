import { document } from 'global';

/**
 * Svelte doesn't support an object for the style attribute but we want to
 * share the styles. Since React uses the property names of HTMLElement's we
 * can just apply them to a frag and then get the string result of the `style`
 * attribute. This means that invalid styles are also filtered out.
 *
 * @param {Object} jsonStyles
 * @returns {string}
 * @see https://stackoverflow.com/questions/38533544/jsx-css-to-inline-styles
 */
export default function jsonToCss(jsonStyles) {
  const frag = document.createElement('div');

  Object.keys(jsonStyles).forEach(key => {
    frag.style[key] = jsonStyles[key];
  });

  return frag.getAttribute('style');
}
