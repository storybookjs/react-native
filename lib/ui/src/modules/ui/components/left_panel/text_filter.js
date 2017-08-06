import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';
import { baseFonts } from '../theme';

const mainStyle = {
  ...baseFonts,
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative',
};

const textWrapStyle = {
  background: '#F7F7F7',
};

const textStyle = {
  fontSize: 12,
  color: '#828282',
  padding: 5,
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  border: 0,
  height: 26,
};

const clearButtonStyle = {
  position: 'absolute',
  backgroundColor: 'transparent',
  color: '#868686',
  border: 'none',
  width: 25,
  height: 26,
  right: 1,
  top: 0,
  textAlign: 'center',
  cursor: 'pointer',
  lineHeight: '23px',
  fontSize: 20,
};

const debounceFilterChangeTimeout = 500;

export default class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.onChange = this.onChange.bind(this);
    this.fireOnClear = this.fireOnClear.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.changeFilter = debounce(this.changeFilter, debounceFilterChangeTimeout);
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ query: text });
    this.changeFilter(text);
  }

  setInputRef(input) {
    this.inputRef = input;
    this.inputRef.value = this.props.text || '';
  }

  fireOnClear() {
    this.inputRef.value = '';
    this.setState({ query: '' });
    const { onClear } = this.props;
    if (onClear) onClear();
  }

  changeFilter(text) {
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  render() {
    return (
      <div style={mainStyle}>
        <div style={textWrapStyle}>
          <input
            style={textStyle}
            type="text"
            placeholder="Filter"
            name="filter-text"
            ref={this.setInputRef}
            onChange={this.onChange}
          />
        </div>
        {this.state.query &&
          this.state.query.length &&
          <button style={clearButtonStyle} onClick={this.fireOnClear} className="clear">
            ×
          </button>}
      </div>
    );
  }
}

TextFilter.defaultProps = {
  text: '',
  onChange: null,
  onClear: null,
};

TextFilter.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};
