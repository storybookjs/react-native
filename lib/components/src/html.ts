import * as rawComponents from './typography/DocumentFormatting';

export * from './typography/DocumentFormatting';

export const components = Object.entries(rawComponents).reduce(
  (acc, [k, v]) => ({
    ...acc,
    [k.toLowerCase()]: v,
  }),
  {}
);
