import React, { Component } from 'react';
import json from 'format-json';
import Textarea from 'react-textarea-autosize';
import PropTypes from 'prop-types';

const styles = {
  label: {
    display: 'table-cell',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    paddingRight: '5px',
    paddingTop: '7px',
    textAlign: 'right',
    width: '100px',
    fontSize: '12px',
    color: 'rgb(68, 68, 68)',
    fontWeight: '600',
  },
  button: {
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
  },
  textArea: {
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
  item: {
    display: 'flex',
    padding: '5px',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
  failed: {
    border: '1px solid #fadddd',
    backgroundColor: '#fff5f5',
  },
};

export default class Item extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onEmit: PropTypes.func.isRequired,
    payload: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    payload: {},
  };

  static getJSONFromString(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  state = {};

  componentWillMount() {
    const payloadString = json.plain(this.props.payload);

    this.setState({
      failed: false,
      payload: Item.getJSONFromString(payloadString),
      payloadString,
      isTextAreaShowed: false,
    });
  }

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
    this.props.onEmit({
      name: this.props.name,
      payload: this.state.payload,
    });
  };

  onToggleEditClick = () => {
    this.setState(({ isTextAreaShowed }) => ({
      isTextAreaShowed: !isTextAreaShowed,
    }));
  };

  render() {
    const { title, name } = this.props;
    const { failed, isTextAreaShowed } = this.state;

    const extraStyle = {};
    Object.assign(extraStyle, isTextAreaShowed ? {} : { ...styles.hidden });
    Object.assign(extraStyle, failed ? { ...styles.failed } : {});

    return (
      <div style={styles.item}>
        <label htmlFor={`addon-event-${name}`} style={styles.label}>
          {title}
        </label>
        <button
          style={styles.button}
          onClick={this.onEmitClick}
          disabled={failed}
          title="Submit event"
        >
          📢
        </button>
        <Textarea
          id={`addon-event-${name}`}
          style={{ ...styles.textArea, ...extraStyle }}
          value={this.state.payloadString}
          onChange={this.onChange}
        />
        {isTextAreaShowed ? (
          <button style={styles.button} onClick={this.onToggleEditClick} title="Close editing">
            ❌
          </button>
        ) : (
          <button style={styles.button} onClick={this.onToggleEditClick} title="Edit event payload">
            ✏️
          </button>
        )}
      </div>
    );
  }
}
