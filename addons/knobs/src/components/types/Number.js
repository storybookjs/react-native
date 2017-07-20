import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '25px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
};

class NumberType extends React.Component {
  constructor(props) {
    super(props);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderRange = this.renderRange.bind(this);
  }

  renderNormal() {
    const { knob, onChange } = this.props;

    return (
      <input
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        value={knob.value}
        type="number"
        onChange={() => onChange(parseFloat(this.input.value))}
      />
    );
  }

  renderRange() {
    const { knob, onChange } = this.props;

    return (
      <input
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        value={knob.value}
        type="range"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={() => onChange(parseFloat(this.input.value))}
      />
    );
  }

  render() {
    const { knob } = this.props;

    return knob.range ? this.renderRange() : this.renderNormal();
  }
}

NumberType.defaultProps = {
  knob: {},
  onChange: value => value,
};

NumberType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = value => String(value);
NumberType.deserialize = value => parseFloat(value);

export default NumberType;
