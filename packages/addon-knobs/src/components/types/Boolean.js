import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'top',
  height: 21,
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  color: '#555',
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
  knob: PropTypes.object,
  onChange: PropTypes.func,
};

BooleanType.serialize = function(value) {
  return String(value);
};

BooleanType.deserialize = function(value) {
  if (!value) return false;
  return value.trim() === 'true';
};

export default BooleanType;
