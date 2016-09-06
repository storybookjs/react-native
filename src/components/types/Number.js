import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  padding: '5px',
  color: 'rgb(130, 130, 130)',
};

class NumberType extends React.Component {
  render() {
    const { value, name, onChange } = this.props;

    return (
      <input
        id={name}
        ref="input"
        style={styles}
        value={value}
        type="number"
        onChange={() => onChange(parseInt(this.refs.input.value))}
      />
    );
  }
}

NumberType.propTypes = {
  value: React.PropTypes.number,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default NumberType;
