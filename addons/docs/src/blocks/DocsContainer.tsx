/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { DocsWrapper, DocsContent } from '@storybook/components';
import * as html from '@storybook/components/html';
import { DocsContextProps, DocsContext } from './DocsContext';

interface DocsContainerProps {
  context: DocsContextProps;
  content: React.ElementType<any>;
}

const defaultComponents = Object.entries(html).reduce(
  (acc, [k, v]) => ({
    ...acc,
    [k.toLowerCase()]: v,
  }),
  {}
);

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
        <MDXProvider components={components}>
          <DocsWrapper>
            <DocsContent>
              <MDXContent components={components} />
            </DocsContent>
          </DocsWrapper>
        </MDXProvider>
      </ThemeProvider>
    </DocsContext.Provider>
  );
};
