import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import { styled } from '@storybook/theming';
import json from 'format-json';

import Textarea from 'react-textarea-autosize';

const StyledTextarea = styled(Textarea)(
  {
    flex: '1 0 0',
    boxSizing: 'border-box',
    margin: '0 0 0 5px',
    verticalAlign: 'top',
    outline: 'none',
    border: '1px solid #c7c7c7',
    borderRadius: 2,
    fontSize: 13,
    padding: '8px 5px 7px 8px',
    color: 'rgb(51, 51, 51)',
    fontFamily: 'Arial, sans-serif',
    minHeight: '32px',
    resize: 'vertical',
  },
  ({ shown }) =>
    shown
      ? {}
      : {
          display: 'none',
        },
  ({ failed }) =>
    failed
      ? {
          border: '1px solid #fadddd',
          backgroundColor: '#fff5f5',
        }
      : {}
);

const Button = styled.button({
  display: 'table-cell',
  textTransform: 'uppercase',
  letterSpacing: '3.5px',
  fontSize: 12,
  fontWeight: 'bolder',
  color: 'rgb(130, 130, 130)',
  border: '1px solid rgb(193, 193, 193)',
  textAlign: 'center',
  borderRadius: 2,
  padding: 5,
  cursor: 'pointer',
  paddingLeft: 8,
  margin: '0 0 0 5px',
  backgroundColor: 'inherit',
  verticalAlign: 'top',
  outline: 0,
});

const Label = styled.label({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  paddingRight: 5,
  paddingTop: 7,
  textAlign: 'right',
  width: 100,
  fontWeight: '600',
});

const Wrapper = styled.div({
  display: 'flex',
  padding: 5,
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  width: '100%',
});

function getJSONFromString(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

class Item extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onEmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
    payload: PropTypes.any,
  };

  static defaultProps = {
    payload: {},
  };

  state = {
    isTextAreaShowed: false,
  };

  onChange = ({ target: { value } }) => {
    const newState = {
      payloadString: value,
    };

    try {
      newState.payload = JSON.parse(value.trim());
      newState.failed = false;
    } catch (err) {
      newState.failed = true;
    }

    this.setState(newState);
  };

  onEmitClick = () => {
    const { onEmit, name } = this.props;
    const { payload } = this.state;

    onEmit({
      name,
      payload,
    });
  };

  onToggleEditClick = () => {
    this.setState(({ isTextAreaShowed }) => ({
      isTextAreaShowed: !isTextAreaShowed,
    }));
  };

  static getDerivedStateFromProps = ({ payload }, { prevPayload }) => {
    if (payload !== prevPayload) {
      const payloadString = json.plain(payload);

      return {
        failed: false,
        payload: getJSONFromString(payloadString),
        payloadString,
        prevPayload,
      };
    }
    return null;
  };

  render() {
    const { title, name } = this.props;
    const { failed, isTextAreaShowed, payloadString } = this.state;

    return (
      <Wrapper>
        <Label htmlFor={`addon-event-${name}`}>{title}</Label>
        <Button onClick={this.onEmitClick} disabled={failed} title="Submit event">
          <span role="img" aria-label="emit">
            📢
          </span>
        </Button>
        <StyledTextarea
          shown={isTextAreaShowed}
          failed={failed}
          value={payloadString}
          onChange={this.onChange}
        />
        {isTextAreaShowed ? (
          <Button onClick={this.onToggleEditClick} title="Close editing">
            <span role="img" aria-label="close">
              ❌
            </span>
          </Button>
        ) : (
          <Button onClick={this.onToggleEditClick} title="Edit event payload">
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </Button>
        )}
      </Wrapper>
    );
  }
}

polyfill(Item);

export default Item;
