import React, { FC, SyntheticEvent, useState } from 'react';
import { Source } from '@storybook/components';
import { Code, components } from '@storybook/components/html';
import { document, window } from 'global';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
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

export const CodeOrSourceMdx: FC<CodeOrSourceMdxProps> = ({ className, children, ...rest }) => {
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

export const AnchorMdx: FC<AnchorMdxProps> = ({ href, target, children, ...rest }) => {
  if (!isNil(href)) {
    // Enable scrolling for in-page anchors.
    if (href.startsWith('#')) {
      return <AnchorInPage href={href}>{children}</AnchorInPage>;
    }

    // Links to other pages of SB should use the base URL of the top level iframe instead of the base URL of the preview iframe.
    if (target !== '_blank') {
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

interface HeaderMdxProps {
  as: string;
  id: string;
}

const OcticonLink = styled.a<{ visibility: string }>(({ visibility }) => ({
  position: 'absolute',
  left: '-22px',
  visibility,
}));

const HeaderMdx: FC<HeaderMdxProps> = ({ as, id, children, ...rest }) => {
  const [linkVisibility, setLinkVisibility] = useState('hidden');
  const href = `${window.parent.location.href}#${id}`;

  // @ts-ignore
  const Header = styled(components[as])({
    position: 'relative',
  });

  // TODO: Make sure it doesn't hide when it's on the link
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <Header
      id={id}
      {...rest}
      onMouseOver={() => {
        setLinkVisibility('visible');
      }}
      onMouseOut={() => {
        setLinkVisibility('hidden');
      }}
    >
      <OcticonLink aria-hidden="true" href={href} visibility={linkVisibility}>
        <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
          />
        </svg>
      </OcticonLink>
      {children}
    </Header>
  );
};

export const AllHeadersMdx = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].reduce(
  (accumulator: Record<string, any>, current: string) => {
    accumulator[current] = (props: any) => <HeaderMdx as={current} {...props} />;

    return accumulator;
  },
  {}
);
