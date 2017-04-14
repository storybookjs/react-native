import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'react-textarea-autosize';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
};

class ArrayType extends React.Component {
  render() {
    const { knob, onChange } = this.props;
    return (
      <Textarea
        id={knob.name}
        ref="input"
        style={styles}
        value={knob.value.join(knob.separator)}
        onChange={e => onChange(e.target.value.split(knob.separator))}
      />
    );
  }
}

ArrayType.propTypes = {
  knob: PropTypes.object,
  onChange: PropTypes.func,
};

ArrayType.serialize = function(value) {
  return value;
};

ArrayType.deserialize = function(value) {
  return value;
};

export default ArrayType;
