import React from 'react';

const preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: '0',
  position: 'absolute',
  top: '30px',
  right: 0,
  bottom: 0,
  left: 0,
};

const wrapStyle = {
  position: 'relative',
  height: '100%',
};

const headStyle = {
  fontFamily: `
    -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
    "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
  `,
  color: '#444',
  letterSpacing: '2px',
  fontSize: 12,
  margin: '0 0 0 5px',
};

const btnStyle = {
  marginLeft: 5,
};

const ActionLogger = ({ actionLog, onClear }) => (
  <div style={wrapStyle}>
    <h3 style={headStyle}>
      ACTION LOGGER
      <button style={btnStyle} onClick={onClear}>CLEAR</button>
    </h3>
    <pre style={preStyle}>{actionLog}</pre>
  </div>
);

ActionLogger.propTypes = {
  actionLog: React.PropTypes.string.isRequired,
  onClear: React.PropTypes.func,
};

export default ActionLogger;
