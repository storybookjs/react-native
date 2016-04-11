import React from 'react';

export default class TextFilter extends React.Component {
  onChange(event) {
    const filterText = event.target.value;
    this.props.onChange(filterText);
  }

  render() {
    const mainStyle = {
      border: '1px solid #ECECEC',
      borderRadius: 2,
    };

    const filterTextWrapStyle = {
      background: '#F7F7F7',
      paddingRight: 25,
    };

    const filterTextStyle = {
      fontSize: 12,
      color: '#828282',
      border: 'none',
      padding: 5,
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      outline: 'none',
    };

    const clearButtonStyle = {
      position: 'absolute',
      color: '#B1B1B1',
      border: 'none',
      padding: 3,
      width: 25,
      right: 0,
      top: 0,
      textAlign: 'center',
      boxSizing: 'border-box',
      cursor: 'pointer',
    };

    return (
      <div style={mainStyle}>
        <div style={filterTextWrapStyle}>
          <input
            style={filterTextStyle}
            type="text"
            placeholder="Filter"
            name="filter-text"
            value={this.props.filterText}
            onChange={this.onChange.bind(this)}
          />
        </div>
        <div
          style={clearButtonStyle}
          onClick={this.props.onClear}
        >x
        </div>
      </div>
    );
  }
}

TextFilter.propTypes = {
  filterText: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onClear: React.PropTypes.func,
};
