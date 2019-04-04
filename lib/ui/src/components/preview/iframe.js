import window from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// this component renders an iframe, which gets updates via post-messages
export class IFrame extends Component {
  iframe = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps) {
    const { scale } = this.props;
    return scale !== nextProps.scale;
  }

  componentDidUpdate(prevProps) {
    const { scale } = this.props;
    if (scale !== prevProps.scale) {
      this.setIframeBodyStyle({
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        transform: `scale(${1 / scale})`,
        transformOrigin: 'top left',
      });
    }
  }

  setIframeBodyStyle(style) {
    return Object.assign(this.iframe.contentDocument.body.style, style);
  }

  render() {
    const { id, title, src, allowFullScreen, scale, ...rest } = this.props;
    return (
      <iframe
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
