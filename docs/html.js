import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { prefixLink } from 'gatsby-helpers';
import typography from './utils/typography';
import { colors } from 'utils/colors';
import favicon from './design/homepage/storybook-icon.png';

const BUILD_TIME = new Date().getTime();

class HTML extends Component {
  render() {
    const title = DocumentTitle.rewind();

    let css;
    if (process.env.NODE_ENV === 'production') {
      css = <style dangerouslySetInnerHTML={{ __html: require('!raw!./public/styles.css') }} />;
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{title}</title>
          <link rel="icon" href={favicon} type="image/x-icon" />
          {css}
        </head>
        <body>
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
        </body>
      </html>
    );
  }
}

HTML.displayName = 'HTML';
HTML.propTypes = {
  body: PropTypes.string,
};

export default HTML;
