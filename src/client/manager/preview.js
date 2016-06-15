import React from 'react';

const iframeStyle = {
  width: '100%',
  height: '100%',
  border: 0,
  margin: 0,
  padding: 0,
};

const Preview = ({ url }) => (
  <iframe
    style={iframeStyle}
    src={url}
  />
);

Preview.propTypes = {
  url: React.PropTypes.string,
};

export default Preview;
