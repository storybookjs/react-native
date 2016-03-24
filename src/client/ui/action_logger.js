import React from 'react';

class ActionLogger extends React.Component {
  render() {
    const h3Style = {
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
      color: '#444',
      letterSpacing: '2px',
      fontSize: 12,
      margin: '12px 0 5px 0'
    };

    const preStyle = {
      height: 105,
      overflowY: 'auto',
      backgroundColor: '#FFF',
      borderRadius: 3,
      padding: 8,
      color: '#666',
      border: '1px solid #EAEAEA'
    };

    return (
      <div>
        <h3 style={h3Style}>ACTION LOGGER</h3>
        <pre style={preStyle}>{this.props.actionLog}</pre>
      </div>
    );
  }
}

export default ActionLogger;
