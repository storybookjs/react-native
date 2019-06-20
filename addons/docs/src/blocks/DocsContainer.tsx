/* eslint-disable react/destructuring-assignment */

import React from 'react';
// import { MDXProvider } from '@mdx-js/react';
import { Global, createGlobal, ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { DocumentFormatting, DocsWrapper, DocsContent } from '@storybook/components';
import { DocsContextProps, DocsContext } from './DocsContext';

interface DocsContainerProps {
  context: DocsContextProps;
  content: React.ElementType<any>;
}

const defaultComponents = {
  // p: ({ children }) => <b>{children}</b>,
  wrapper: DocumentFormatting,
};

const globalWithOverflow = (args: any) => {
  const global = createGlobal(args);
  const { body, ...rest } = global;
  const { overflow, ...bodyRest } = body;
  return {
    body: bodyRest,
    ...rest,
  };
};

export const DocsContainer: React.FunctionComponent<DocsContainerProps> = ({
  context,
  content: MDXContent,
}) => {
  const parameters = (context && context.parameters) || {};
  const options = parameters.options || {};
  const theme = ensureTheme(options.theme);
  const { components: userComponents = null } = options.docs || {};
  const components = { ...defaultComponents, ...userComponents };
  return (
    <DocsContext.Provider value={context}>
      <ThemeProvider theme={theme}>
        <Global styles={globalWithOverflow} />
        {/* <MDXProvider components={components}> */}
        <DocsWrapper>
          <DocsContent>
            <MDXContent components={components} />
          </DocsContent>
        </DocsWrapper>
        {/* </MDXProvider> */}
      </ThemeProvider>
    </DocsContext.Provider>
  );
};
