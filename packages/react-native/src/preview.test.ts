import preview from './preview';

// Regression test for the entry-point bug where `argTypesEnhancers` and
// `parameters.docs.extractArgTypes` were imported from
// `@storybook/react/entry-preview-docs` — which does not export them, so both
// resolved to `undefined` and docgen-based auto argTypes were silently disabled.
// They are exported from `@storybook/react/entry-preview-argtypes`.
describe('preview docgen wiring', () => {
  it('wires argTypesEnhancers from @storybook/react', () => {
    expect(Array.isArray(preview.argTypesEnhancers)).toBe(true);
    expect(preview.argTypesEnhancers?.length).toBeGreaterThan(0);
    preview.argTypesEnhancers?.forEach((enhancer) => {
      expect(typeof enhancer).toBe('function');
    });
  });

  it('wires parameters.docs.extractArgTypes from @storybook/react', () => {
    expect(typeof preview.parameters?.docs?.extractArgTypes).toBe('function');
  });
});
