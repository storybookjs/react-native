import * as React from 'react';
import { Source } from '@storybook/components';
import { Code, A } from '@storybook/components/html';
import { DocsContext, DocsContextProps } from './DocsContext';
import { AnchorInPage } from './Anchor';

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

interface CodeOrSourceMdxProps {
  className?: string;
}
export const CodeOrSourceMdx: React.FC<CodeOrSourceMdxProps> = ({
  className,
  children,
  ...rest
}) => {
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

interface AnchorMdxProps {
  href: string;
}

// TODO: use A from html components
export const AnchorMdx: React.FC<AnchorMdxProps> = ({ href, children, ...rest }) => {
  if (href.startsWith('#')) {
    return <AnchorInPage href={href}>{children}</AnchorInPage>;
  }

  return (
    <A href={href} {...rest}>
      {children}
    </A>
  );
};
