import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';

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
    fontSize: 12,
    whiteSpace: 'nowrap',
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

    this.state = {
      value: props.knob.value,
    };

    this.onChange = debounce(props.onChange, 400);
  }

  handleChange = event => {
    const { value } = event.target;

    this.setState({ value });

    let parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      parsedValue = null;
    }

    this.onChange(parsedValue);
  };

  renderNormal() {
    const { knob } = this.props;
    const { value } = this.state;

    return (
      <input
        id={knob.name}
        style={{ ...styles.common, ...styles.normal }}
        value={value}
        type="number"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={this.handleChange}
      />
    );
  }

  renderRange() {
    const { knob } = this.props;
    const { value } = this.state;

    return (
      <div style={styles.rangeWrapper}>
        <span style={styles.rangeLabel}>{knob.min}</span>
        <input
          id={knob.name}
          style={{ ...styles.common, ...styles.range }}
          value={value}
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          onChange={this.handleChange}
        />
        <span style={styles.rangeLabel}>{`${value} / ${knob.max}`}</span>
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
