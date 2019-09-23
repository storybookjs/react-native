import React from 'react';
import { document } from 'global';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider, ensure as ensureTheme } from '@storybook/theming';
import { DocsWrapper, DocsContent, Source } from '@storybook/components';
import { components as htmlComponents, Code } from '@storybook/components/html';
import { DocsContextProps, DocsContext } from './DocsContext';
import { anchorBlockIdFromId } from './Anchor';
import { storyBlockIdFromId } from './Story';

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
  const { id: storyId = null, parameters = {} } = context || {};
  const options = parameters.options || {};
  const theme = ensureTheme(options.theme);
  const { components: userComponents = null } = parameters.docs || {};
  const components = { ...defaultComponents, ...userComponents };

  React.useEffect(() => {
    let element = document.getElementById(anchorBlockIdFromId(storyId));
    if (!element) {
      element = document.getElementById(storyBlockIdFromId(storyId));
    }
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [storyId]);
  return (
    <DocsContext.Provider value={context}>
      <ThemeProvider theme={theme}>
        <MDXProvider components={components}>
          <DocsWrapper className="sbdocs sbdocs-wrapper">
            <DocsContent className="sbdocs sbdocs-content">{children}</DocsContent>
          </DocsWrapper>
        </MDXProvider>
      </ThemeProvider>
    </DocsContext.Provider>
  );
};
