---
"@storybook/react-native": patch
---

Fix docgen-based auto argTypes (controls) that were silently disabled. `preview.ts` imported `argTypesEnhancers` and `parameters.docs.extractArgTypes` from `@storybook/react/entry-preview-docs`, which does not export them, so both resolved to `undefined`. They are now imported from `@storybook/react/entry-preview-argtypes`, restoring auto-generated controls from component `__docgenInfo`.
