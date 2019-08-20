/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { DocsWrapper, DocsContent, Source } from '@storybook/components';
import { components as htmlComponents, Code } from '@storybook/components/html';
import { DocsContextProps, DocsContext } from './DocsContext';

interface DocsContainerProps {
  context: DocsContextProps;
}

interface CodeOrSourceProps {
  className?: string;
}
export const CodeOrSource: React.FC<CodeOrSourceProps> = props => {
  const { className, children, ...rest } = props;
  // markdown-to-jsx does not add className to inline code
  if (
    typeof className !== 'string' &&
    (typeof children !== 'string' || !(children as string).match(/[\n\r]/g))
  ) {
    return <Code>{children}</Code>;
  }
  // className: "lang-jsx"
  const language = className && className.split('-');
  return (
    <Source
      language={(language && language[1]) || 'plaintext'}
      format={false}
      code={children as string}
      {...rest}
    />
  );
};

const defaultComponents = {
  ...htmlComponents,
  code: CodeOrSource,
};

export const DocsContainer: React.FunctionComponent<DocsContainerProps> = ({
  context,
  children,
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
            <DocsContent>{children}</DocsContent>
          </DocsWrapper>
        </MDXProvider>
      </ThemeProvider>
    </DocsContext.Provider>
  );
};
