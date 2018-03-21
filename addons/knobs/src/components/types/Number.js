import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  common: {
    boxSizing: 'border-box',
    height: '25px',
    outline: 'none',
    border: '1px solid #f7f4f4',
    borderRadius: 2,
    fontSize: 11,
    padding: '5px',
    color: '#444',
  },
  normal: {
    display: 'table-cell',
    width: '100%',
    verticalAlign: 'middle',
  },
  range: {
    flexGrow: 1,
  },
  rangeLabel: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  rangeWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
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
        style={{ ...styles.common, ...styles.normal }}
        value={knob.value}
        type="number"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={() => onChange(parseFloat(this.input.value))}
      />
    );
  }

  renderRange() {
    const { knob, onChange } = this.props;

    return (
      <div style={styles.rangeWrapper}>
        <span style={styles.rangeLabel}>{knob.min}</span>
        <input
          id={knob.name}
          ref={c => {
            this.input = c;
          }}
          style={{ ...styles.common, ...styles.range }}
          value={knob.value}
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          onChange={() => onChange(parseFloat(this.input.value))}
        />
        <span style={styles.rangeLabel}>{`${knob.value} / ${knob.max}`}</span>
      </div>
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
