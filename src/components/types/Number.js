import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: '12px',
  padding: '5px',
  color: 'rgb(130, 130, 130)',
};

class NumberType extends React.Component {
  render() {
    const { knob, onChange } = this.props;

    return (
      <input
        id={knob.name}
        ref="input"
        style={styles}
        value={knob.value}
        type="number"
        onChange={() => onChange(parseFloat(this.refs.input.value))}
      />
    );
  }
}

NumberType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

NumberType.serialize = function (value) {
  return String(value);
};

NumberType.deserialize = function (value) {
  return parseFloat(value);
};

export default NumberType;
