import React, { Component } from 'react';
import stringify from 'json-stringify-safe';

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

const latestActionLogStyle = {
  backgroundColor: 'lightgreen',
  transition: 'all .5s ease-in',
};

class ActionLogger extends Component {
  componentDidUpdate() {
    if (this.refs.actionLogger && window.setTimeout) {
      this.refs.actionLogger.style.backgroundColor = latestActionLogStyle.backgroundColor;
      setTimeout(() => {
        this.refs.actionLogger.style.backgroundColor = 'white';
      }, 800);
    }
  }

  getActionData() {
    const { actions = [] } = this.props.data;
    return actions
    .map((action, i) => {
      // assuming that the first object in the array is the latest addition.
      return i === 0 ? (
        <div style={latestActionLogStyle} ref="actionLogger" key={i}>
          {stringify(action, null, 2)}
        </div>
        ) : (
        <div key={i}>
          {stringify(action, null, 2)}
        </div>
        );
    });
  }

  render() {
    const { onClear } = this.props;
    return (
      <div>
        <h3 style={h3Style}>
          ACTION LOGGER
          <button style={clearButtonStyle} onClick={onClear}>CLEAR</button>
        </h3>
        <pre style={preStyle}>{this.getActionData()}</pre>
      </div>
      );
  }
}

ActionLogger.propTypes = {
  onClear: React.PropTypes.func,
  data: React.PropTypes.array.isRequired,
};

export default ActionLogger;
