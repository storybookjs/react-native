import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Global, css } from '@storybook/theming';

export class IFrame extends Component {
  // this component renders an iframe, which gets updates via post-messages
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { id, title, src, allowFullScreen, ...rest } = this.props;
    return (
      <Fragment>
        <Global
          styles={css({
            iframe: {
              border: '0 none',
            },
          })}
        />
        <iframe id={id} title={title} src={src} allowFullScreen={allowFullScreen} {...rest} />
      </Fragment>
    );
  }
}
IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired,
};
