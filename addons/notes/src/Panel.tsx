import React, { ReactElement, Fragment, ReactNode } from 'react';
import { types } from '@storybook/addons';
import { API, Consumer, Combo } from '@storybook/api';
import { Link as RouterLink } from '@storybook/router';
import { styled } from '@storybook/theming';

import {
  SyntaxHighlighter as SyntaxHighlighterBase,
  Placeholder,
  DocumentWrapper,
  Link,
  TabWrapper,
  TabsState,
} from '@storybook/components';
import Markdown from 'markdown-to-jsx';
import Giphy from './giphy';

import { formatter } from './formatter';

import { PARAM_KEY, Parameters } from './shared';

const Panel = styled.div<{}>(({ theme }) => ({
  padding: '3rem 40px',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 980,
  margin: '0 auto',
  ...(theme.addonNotesTheme || {}),
}));

interface Props {
  active: boolean;
  api: API;
}

function read(param: Parameters | undefined): Record<string, string> | string | undefined {
  if (!param) {
    return undefined;
  }
  if (typeof param === 'string') {
    return param;
  }
  if ('disable' in param) {
    return undefined;
  }
  if ('text' in param) {
    return param.text;
  }
  if ('markdown' in param) {
    return param.markdown;
  }
  if (typeof param === 'object') {
    return param;
  }
  return undefined;
}

interface SyntaxHighlighterProps {
  className?: string;
  children: ReactElement;
  [key: string]: any;
}
export const SyntaxHighlighter = ({ className, children, ...props }: SyntaxHighlighterProps) => {
  // markdown-to-jsx does not add className to inline code
  if (typeof className !== 'string') {
    return <code>{children}</code>;
  }
  // className: "lang-jsx"
  const language = className.split('-');
  return (
    <SyntaxHighlighterBase
      language={language[1] || 'plaintext'}
      bordered
      format={false}
      copyable
      {...props}
    >
      {children}
    </SyntaxHighlighterBase>
  );
};

interface NotesLinkProps {
  href: string;
  children: ReactElement;
}
export const NotesLink = ({ href, children, ...props }: NotesLinkProps) => {
  /* https://github.com/sindresorhus/is-absolute-url/blob/master/index.js */
  const isAbsoluteUrl = /^[a-z][a-z0-9+.-]*:/.test(href);
  if (isAbsoluteUrl) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
};

// use our SyntaxHighlighter component in place of a <code> element when
// converting markdown to react elements
const defaultOptions = {
  overrides: {
    code: SyntaxHighlighter,
    a: NotesLink,
    Giphy: {
      component: Giphy,
    },
  },
};

interface Overrides {
  overrides: {
    [type: string]: ReactNode;
  };
}
type Options = typeof defaultOptions & Overrides;

const mapper = ({
  state,
  api,
}: Combo): { value?: string | Record<string, string>; options: Options } => {
  const extraElements = Object.entries(api.getElements(types.NOTES_ELEMENT)).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: v.render }),
    {}
  );
  const options = {
    ...defaultOptions,
    overrides: { ...defaultOptions.overrides, ...extraElements },
  };

  const story = state.storiesHash[state.storyId];
  const value = read(story ? api.getParameters(story.id, PARAM_KEY) : undefined);

  return { options, value };
};

const NotesPanel = ({ active }: Props) => {
  if (!active) {
    return null;
  }

  return (
    <Consumer filter={mapper}>
      {({ options, value }: { options: Options; value?: string | Record<string, string> }) => {
        if (!value) {
          return (
            <Placeholder>
              <Fragment>No notes yet</Fragment>
              <Fragment>
                Learn how to{' '}
                <Link
                  href="https://github.com/storybookjs/storybook/tree/master/addons/notes"
                  target="_blank"
                  withArrow
                  secondary
                  cancel={false}
                >
                  document components in Markdown
                </Link>
              </Fragment>
            </Placeholder>
          );
        }

        if (typeof value === 'string' || Object.keys(value).length === 1) {
          const md = typeof value === 'object' ? Object.values(value)[0] : value;

          return (
            <Panel className="addon-notes-container">
              <DocumentWrapper>
                <Markdown options={options}>{formatter(md)}</Markdown>
              </DocumentWrapper>
            </Panel>
          );
        }

        const groups: { title: string; render: (props: { active: boolean }) => void }[] = [];

        Object.entries(value).forEach(([title, docs]) => {
          groups.push({
            title,
            render: ({ active: isActive }) => (
              <TabWrapper key={title} active={isActive}>
                <Panel>
                  <DocumentWrapper>
                    <Markdown options={options}>{formatter(docs)}</Markdown>
                  </DocumentWrapper>
                </Panel>
              </TabWrapper>
            ),
          });
        });

        return (
          <div className="addon-notes-container">
            <TabsState>
              {groups.map(group => (
                <div id={group.title} key={group.title} title={group.title}>
                  {group.render}
                </div>
              ))}
            </TabsState>
          </div>
        );
      }}
    </Consumer>
  );
};

export default NotesPanel;
