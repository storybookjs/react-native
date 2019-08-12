import window from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

const StyledIframe = styled.iframe({
  position: 'absolute',
  display: 'block',
  boxSizing: 'content-box',
  height: '100%',
  width: '100%',
  border: '0 none',
  transition: 'all .3s, background-position 0s',
  backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
});

export class IFrame extends Component {
  iframe = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps) {
    const { scale } = this.props;

    if (scale !== nextProps.scale) {
      this.setIframeBodyStyle({
        width: `${nextProps.scale * 100}%`,
        height: `${nextProps.scale * 100}%`,
        transform: `scale(${1 / nextProps.scale})`,
        transformOrigin: 'top left',
      });
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  setIframeBodyStyle(style) {
    return Object.assign(this.iframe.contentDocument.body.style, style);
  }

  render() {
    const { id, title, src, allowFullScreen, scale, ...rest } = this.props;
    return (
      <StyledIframe
        scrolling="yes"
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        {...rest}
      />
    );
  }
}
IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  allowFullScreen: PropTypes.bool.isRequired,
  scale: PropTypes.number.isRequired,
};
