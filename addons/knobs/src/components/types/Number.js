import PropTypes from 'prop-types';
import React from 'react';

import styled from 'react-emotion';

const base = {
  boxSizing: 'border-box',
  height: '25px',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
};

const TextInput = styled('input')(base, {
  display: 'table-cell',
  width: '100%',
  verticalAlign: 'middle',
});
const RangeInput = styled('input')(base, {
  display: 'table-cell',
  flexGrow: 1,
});
const RangeLabel = styled('span')({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});
const RangeWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

class NumberType extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      return { value: props.knob.value };
    }
    return null;
  }

  handleChange = event => {
    const { value } = event.target;

    this.setState({ value });

    let parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      parsedValue = null;
    }

    this.props.onChange(parsedValue);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return knob.range ? (
      <RangeWrapper>
        <RangeLabel>{knob.min}</RangeLabel>
        <RangeInput
          id={knob.name}
          value={value}
          type="range"
          min={knob.min}
          max={knob.max}
          step={knob.step}
          onChange={this.handleChange}
        />
        <RangeLabel>{`${value} / ${knob.max}`}</RangeLabel>
      </RangeWrapper>
    ) : (
      <TextInput
        id={knob.name}
        value={value}
        type="number"
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={this.handleChange}
      />
    );
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
