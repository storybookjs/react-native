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

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

class ArrayType extends React.Component {
  render() {
    const { knob, onChange } = this.props;
    return (
      <Textarea
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        value={knob.value.join(knob.separator)}
        onChange={e => onChange(formatArray(e.target.value, knob.separator))}
      />
    );
  }
}

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
ArrayType.deserialize = value => value;

export default ArrayType;
