import React from 'react';

const mainStyle = {
  position: 'fixed',
  top: 0, bottom: 0, left: 0, right: 0,
  padding: 20,
  backgroundColor: 'rgb(187, 49, 49)',
  color: '#FFF',
  fontFamily: `
    -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI",
    "Helvetica Neue", "Lucida Grande", sans-serif'
    `,
};

const headingStyle = {
  fontFamily: 'inherit',
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 'normal',
  margin: '10px 0',
};

const codeStyle = {
  fontSize: 14,
  width: '100vw',
  overflow: 'auto',
};

const ErrorDisplay = ({ error }) => (
  <div style={mainStyle}>
    <div style={headingStyle}>{error.message}</div>
    <pre style={codeStyle}>
      <code>
        {error.stack}
      </code>
    </pre>
  </div>
);

ErrorDisplay.propTypes = {
  error: React.PropTypes.object.isRequired,
};

export default ErrorDisplay;
