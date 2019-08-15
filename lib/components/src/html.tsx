import React from 'react';
import * as rawComponents from './typography/DocumentFormatting';

export * from './typography/DocumentFormatting';

export const components = Object.entries(rawComponents).reduce(
  (acc, [k, V]) => ({
    ...acc,
    [k.toLowerCase()]: (props: object) => <V {...props} className={`sbdocs-${k.toLowerCase()}`} />,
  }),
  {}
);
