import * as React from 'react';
import * as rawComponents from './typography/DocumentFormatting';

export * from './typography/DocumentFormatting';

export const components = Object.entries(rawComponents).reduce(
  (acc, [k, V]) => ({
    ...acc,
    [k.toLowerCase()]: ({ className, ...rest }: { className: string }) => {
      return (
        <V
          {...rest}
          className={`sbdocs sbdocs-${k.toLowerCase()}${className ? ` ${className}` : ''}`}
        />
      );
    },
  }),
  {}
);
