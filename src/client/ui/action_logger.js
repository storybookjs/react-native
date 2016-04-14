import React, { Component } from 'react';
import Foldable from './foldable';

const preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: 0,
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

class ActionLogger extends Component {

  getActionData() {
    return this.props.actionLogs
    .map((action, i) => {
      return <Foldable key={i}>{ action }</Foldable>;
    });
  }

  render() {
    const { onClear } = this.props;
    return (
      <div style={wrapStyle}>
        <h3 style={headStyle}>
          ACTION LOGGER
          <button style={btnStyle} onClick={onClear}>CLEAR</button>
        </h3>
        <pre style={preStyle}>{this.getActionData()}</pre>
      </div>
      );
  }
}

ActionLogger.propTypes = {
  onClear: React.PropTypes.func,
  actionLogs: React.PropTypes.array,
};

export default ActionLogger;
