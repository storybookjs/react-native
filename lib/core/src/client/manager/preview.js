import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styled from '@emotion/styled';

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: 0,
  margin: 'auto',
  padding: 0,
});

class Preview extends Component {
  shouldComponentUpdate() {
    // When the manager is re-rendered, due to changes in the layout (going full screen / changing
    // addon panel to right) Preview section will update. If its re-rendered the whole html page
    // inside the html is re-rendered making the story to re-mount.
    // We dont have to re-render this component for any reason since changes are communicated to
    // story using the channel and necessary changes are done by it.
    return false;
  }

  render() {
    const { url } = this.props;

    return <Iframe id="storybook-preview-iframe" title="preview" src={url} allowFullScreen />;
  }
}

Preview.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Preview;
