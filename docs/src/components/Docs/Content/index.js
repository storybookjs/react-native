/* eslint-disable consistent-return */
import React from 'react';
import PropTypes from 'prop-types';

import { SyntaxHighlighter } from '@storybook/components';
import { ThemeProvider, convert, create } from '@storybook/theming';

import './style.css';
import parse from 'html-react-parser';

const DocsContent = ({ title, content, editUrl, ...rest }) => (
  <div id="docs-content">
    <div className="content">
      <h2 className="title">{title}</h2>
      <p>
        <a className="edit-link" href={editUrl} target="_blank" rel="noopener noreferrer">
          Edit this page
        </a>
      </p>
      <div className="markdown">
        <ThemeProvider theme={convert(create({ base: 'light' }))}>
          {parse(content, {
            replace: domNode => {
              if (
                domNode.name === 'pre' &&
                domNode.children.find(
                  n => n.name === 'code' && n.attribs.class && n.attribs.class.match(/^language-/)
                )
              ) {
                const language = domNode.children[0].attribs.class.replace('language-', '');
                const code = domNode.children[0].children[0].data;
                return (
                  <SyntaxHighlighter copyable language={language}>
                    {code}
                  </SyntaxHighlighter>
                );
              }
            },
          })}
        </ThemeProvider>
        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        {/* <Highlight></Highlight> */}
      </div>
    </div>
  </div>
);

DocsContent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  editUrl: PropTypes.string.isRequired,
};

export { DocsContent as default };
