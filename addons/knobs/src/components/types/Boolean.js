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
        ref={c => {
          this.input = c;
        }}
        style={styles}
        type="checkbox"
        onChange={() => onChange(this.input.checked)}
        checked={knob.value}
      />
    );
  }
}

BooleanType.defaultProps = {
  knob: {},
  onChange: value => value,
};

BooleanType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

BooleanType.serialize = value => String(value);
BooleanType.deserialize = value => (typeof value === 'string' ? value.match('true') : false);

export default BooleanType;
