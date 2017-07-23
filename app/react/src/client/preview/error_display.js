import PropTypes from 'prop-types';
import React from 'react';

const mainStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  padding: 20,
  backgroundColor: 'rgb(187, 49, 49)',
  color: '#FFF',
  WebkitFontSmoothing: 'antialiased',
};

const headingStyle = {
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 0.2,
  margin: '10px 0',
  fontFamily: `
    -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI",
    "Helvetica Neue", "Lucida Grande", sans-serif
    `,
};

const codeStyle = {
  fontSize: 14,
  width: '100vw',
  overflow: 'auto',
};

const ErrorDisplay = ({ error }) =>
  <div style={mainStyle}>
    <div style={headingStyle}>
      {error.message}
    </div>
    <pre style={codeStyle}>
      <code>
        {error.stack}
      </code>
    </pre>
  </div>;

ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string,
  }).isRequired,
};

export default ErrorDisplay;
