/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import favicon from './design/homepage/storybook-icon.png';

const HTML = props => {
  const title = DocumentTitle.rewind();

  let css;
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    css = <style dangerouslySetInnerHTML={{ __html: require('!raw!../public/styles.css') }} />;
  }

  const searchScript = [
    <link
      key="docsearch-css"
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
    />,
    <script
      key="docsearch-js"
      type="text/javascript"
      src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"
    />,
  ];

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/x-icon" />
        {css}
        {props.headComponents}
      </head>
      <body>
        <div id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
        {props.postBodyComponents}
        {searchScript}
      </body>
    </html>
  );
};

HTML.displayName = 'HTML';
HTML.propTypes = {
  headComponents: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired,
  body: PropTypes.string,
};
HTML.defaultProps = {
  body: '',
};

export default HTML;
