import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Inspector from 'react-inspector';
import style from './style';
import NodeRenderer from './NodeRenderer';

class ActionLogger extends Component {
  getActionData() {
    return this.props.actions.map(action => this.renderAction(action));
  }

  renderAction(action) {
    const counter = <div style={style.counter}>{action.count}</div>;
    return (
      <div key={action.id} style={style.action}>
        <div style={style.countwrap}>{action.count > 1 && counter}</div>
        <div style={style.inspector}>
          <Inspector
            nodeRenderer={NodeRenderer}
            sortObjectKeys
            showNonenumerable={false}
            name={action.data.name}
            data={action.data.args || action.data}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={style.wrapper}>
        <pre style={style.actions}>{this.getActionData()}</pre>
        <button style={style.button} onClick={this.props.onClear}>
          CLEAR
        </button>
      </div>
    );
  }
}

ActionLogger.propTypes = {
  onClear: PropTypes.func,
  actions: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};
ActionLogger.defaultProps = {
  onClear: () => {},
  actions: [],
};

export default ActionLogger;
