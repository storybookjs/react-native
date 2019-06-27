import { document } from 'global';

/**
 * Not all frameworks support an object for the style attribute but we want all to
 * consume `styles.json`. Since `styles.json` uses standard style properties for keys,
 * we can just set them on an element and then get the string result of that element's
 * `style` attribute. This also means that invalid styles are filtered out.
 *
 * @param {Object} jsonStyles
 * @returns {string}
 * @see https://stackoverflow.com/questions/38533544/jsx-css-to-inline-styles
 */
export default function jsonToCss(jsonStyles: Partial<CSSStyleDeclaration>) {
  const frag = document.createElement('div') as HTMLDivElement;

  Object.keys(jsonStyles).forEach(key => {
    (frag.style as any)[key] = (jsonStyles as any)[key];
  });

  return frag.getAttribute('style');
}
