/**
 * Storybook's instrumenter serializes the arguments of every instrumented call, such as
 * `userEvent.click(button)` or `expect(input)`. It treats anything that's `instanceof HTMLElement`
 * as a DOM element and reads `localName`, `classList` and `innerText`. React Native defines
 * `HTMLElement` as its own element class, which has none of those, so the serializer throws.
 *
 * This adds them, backed by what React Native elements do have, so elements show up in the
 * Interactions panel as `<RN:TextInput#email>`.
 */
export function patchElementsForInstrumenter() {
  const prototype = (globalThis as { HTMLElement?: { prototype?: object } }).HTMLElement?.prototype;
  if (!prototype || 'classList' in prototype) return;

  type Element = { tagName?: string; textContent?: string };
  Object.defineProperties(prototype, {
    classList: { configurable: true, get: () => [] },
    localName: {
      configurable: true,
      get(this: Element) {
        return this.tagName;
      },
    },
    innerText: {
      configurable: true,
      get(this: Element) {
        return this.textContent;
      },
    },
  });
}
