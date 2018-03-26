import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Inspector from 'react-inspector';
import { Actions, Action, Button, Wrapper, InspectorContainer, Countwrap, Counter } from './style';

class ActionLogger extends Component {
  getActionData() {
    return this.props.actions.map(action => this.renderAction(action));
  }

  renderAction(action) {
    const counter = <Counter>{action.count}</Counter>;
    return (
      <Action key={action.id}>
        <Countwrap>{action.count > 1 && counter}</Countwrap>
        <InspectorContainer>
          <Inspector
            sortObjectKeys
            showNonenumerable={false}
            name={action.data.name}
            data={action.data.args || action.data}
          />
        </InspectorContainer>
      </Action>
    );
  }

  render() {
    return (
      <Wrapper>
        <Actions>{this.getActionData()}</Actions>
        <Button onClick={this.props.onClear}>Clear</Button>
      </Wrapper>
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
