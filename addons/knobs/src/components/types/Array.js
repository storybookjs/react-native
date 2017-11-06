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

const ArrayType = ({ knob, onChange }) => (
  <Textarea
    id={knob.name}
    style={styles}
    value={knob.value.join(knob.separator)}
    onChange={e => onChange(e.target.value.split(knob.separator))}
  />
);

ArrayType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ArrayType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.array,
  }),
  onChange: PropTypes.func,
};

ArrayType.serialize = value => value;
ArrayType.deserialize = value => {
  if (Array.isArray(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export default ArrayType;
