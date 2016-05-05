import React from 'react';
import { baseFonts } from '../theme';

const mainStyle = {
  ...baseFonts,
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative',
};

export default class TextFilter extends React.Component {
  onChange(event) {
    const text = event.target.value;
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  fireOnClear() {
    const { onClear } = this.props;
    if (onClear) onClear();
  }

  render() {
    const textWrapStyle = {
      background: '#F7F7F7',
      paddingRight: 25,
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
      color: '#B1B1B1',
      border: 'none',
      width: 25,
      height: 26,
      right: 0,
      top: 2,
      textAlign: 'center',
      cursor: 'pointer',
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
            onChange={this.onChange.bind(this)}
          />
        </div>
        <div
          style={clearButtonStyle}
          onClick={this.fireOnClear.bind(this)}
        >x
        </div>
      </div>
    );
  }
}

TextFilter.propTypes = {
  text: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onClear: React.PropTypes.func,
};
