import * as React from 'react';
import { DocsContext, DocsContextProps } from './DocsContext';

// Hacky utility for dealing with functions or values in MDX Story elements
export const makeStoryFn = (val: any) => (typeof val === 'function' ? val : () => val);

// Hacky utilty for adding mdxStoryToId to the default context
export const AddContext: React.FC<DocsContextProps> = props => {
  const { children, ...rest } = props;
  const parentContext = React.useContext(DocsContext);
  return (
    <DocsContext.Provider value={{ ...parentContext, ...rest }}>{children}</DocsContext.Provider>
  );
};
