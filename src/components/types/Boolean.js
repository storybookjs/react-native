import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '22px',
  width: '100%',
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: 'rgb(130, 130, 130)',
};

class BooleanType extends React.Component {
  render() {
    const { knob, onChange } = this.props;

    return (
      <input
        id={knob.name}
        ref="input"
        style={styles}
        type="checkbox"
        onChange={() => onChange(this.refs.input.checked)}
        checked={knob.value}
      />
    );
  }
}

BooleanType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

BooleanType.serialize = function(value) {
  return String(value);
};

BooleanType.deserialize = function(value) {
  if (!value) return false;
  return value.trim() === 'true';
};

export default BooleanType;
