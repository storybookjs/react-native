import React, { Component } from 'react';
import json from 'format-json';
import Textarea from 'react-textarea-autosize';
import PropTypes from 'prop-types';

const styles = {
  item: {
    padding: '10 0',
  },
  buttonWrapper: {
    textAlign: 'center',
  },
  button: {
    display: 'inline-block',
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    fontSize: 14,
    padding: 10,
    margin: 10,
    width: '40%',
  },
  textArea: {
    display: 'block',
    boxSizing: 'border-box',
    margin: 0,
    width: '100%',
    maxWidth: '100%',
    verticalAlign: 'middle',
    outline: 'none',
    border: '1px solid #c7c7c7',
    borderRadius: 2,
    fontSize: 13,
    padding: '5px',
    color: 'rgb(51, 51, 51)',
    fontFamily: 'Arial, sans-serif',
  },
};

export default class Item extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onEmit: PropTypes.func.isRequired,
    payload: PropTypes.any,
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
    const { failed, isTextAreaShowed } = this.state;
    const extraStyle = {
      display: isTextAreaShowed ? 'block' : 'none',
    };

    if (failed) {
      extraStyle.border = '1px solid #fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <div style={{ width: '100%' }}>
        <h3>{this.props.title}</h3>
        <div style={styles.buttonWrapper}>
          <button style={styles.button} onClick={this.onEmitClick} disabled={failed}>
            Emit
          </button>
          <button style={styles.button} onClick={this.onToggleEditClick}>
            {isTextAreaShowed ? 'Close' : 'Edit payload'}
          </button>
        </div>

        <Textarea
          ref={ref => {
            this.input = ref;
          }}
          style={{ ...styles.textArea, ...extraStyle }}
          value={this.state.payloadString}
          minRows={3}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
