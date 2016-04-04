import React from 'react';

const h3Style = {
  fontFamily: `
    -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
    "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
  `,
  color: '#444',
  letterSpacing: '2px',
  fontSize: 12,
  margin: '12px 0 5px 0',
};

const preStyle = {
  height: 105,
  overflowY: 'auto',
  backgroundColor: '#FFF',
  borderRadius: 3,
  padding: 8,
  color: '#666',
  border: '1px solid #EAEAEA',
};

const clearButtonStyle = {
  marginLeft: 5,
};

const ActionLogger = ({ actionLog, onClear }) => (
  <div>
    <h3 style={h3Style}>
      ACTION LOGGER
      <button style={clearButtonStyle} onClick={onClear}>CLEAR</button>
    </h3>
    <pre style={preStyle}>{actionLog}</pre>
  </div>
);

ActionLogger.propTypes = {
  actionLog: React.PropTypes.string.isRequired,
  onClear: React.PropTypes.func,
};

export default ActionLogger;
