import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const mainStyle = {
  ...baseFonts,
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative',
};

export default class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.onChange = this.onChange.bind(this);
    this.fireOnClear = this.fireOnClear.bind(this);
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ query: text });
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  fireOnClear() {
    this.setState({ query: '' });

    const { onClear } = this.props;
    if (onClear) onClear();
  }

  render() {
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

    return (
      <div style={mainStyle}>
        <div style={textWrapStyle}>
          <input
            style={textStyle}
            type="text"
            placeholder="Filter"
            name="filter-text"
            value={this.props.text || ''}
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
