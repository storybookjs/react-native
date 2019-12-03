import React, { FC, SyntheticEvent } from 'react';
import { Source } from '@storybook/components';
import { Code, components } from '@storybook/components/html';
import { document, window } from 'global';
import { isNil } from 'lodash';
import { DocsContext, DocsContextProps } from './DocsContext';
import { scrollToElement } from './utils';

// Hacky utility for dealing with functions or values in MDX Story elements
export const makeStoryFn = (val: any) => (typeof val === 'function' ? val : () => val);

// Hacky utilty for adding mdxStoryToId to the default context
export const AddContext: FC<DocsContextProps> = props => {
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

interface AnchorInPageProps {
  href: string;
}

// @ts-ignore
const A = components.a;

const AnchorInPage: FC<AnchorInPageProps> = ({ href, children }) => (
  <A
    href={href}
    onClick={(event: SyntheticEvent) => {
      event.preventDefault();

      const element = document.getElementById(href.substring(1));
      if (element) {
        scrollToElement(element);
      }
    }}
  >
    {children}
  </A>
);

interface AnchorMdxProps {
  href: string;
  target: string;
}

export const AnchorMdx: React.FC<AnchorMdxProps> = ({ href, target, children, ...rest }) => {
  if (!isNil(href)) {
    if (href.startsWith('#')) {
      // Enable scrolling for in-page anchors.
      return <AnchorInPage href={href}>{children}</AnchorInPage>;
    }
    if (target !== '_blank') {
      // Links to other pages of SB should use the base URL of the top level iframe instead of the base URL of the preview iframe.
      const parentUrl = new URL(window.parent.location.href);
      const newHref = `${parentUrl.origin}${href}`;

      return (
        <A href={newHref} target={target} {...rest}>
          {children}
        </A>
      );
    }
  }

  // External URL dont need any modification.
  return (
    <A href={href} target={target} {...rest}>
      {children}
    </A>
  );
};
