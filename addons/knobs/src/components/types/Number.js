import PropTypes from 'prop-types';
import React from 'react';

import { styled } from '@storybook/theming';

import { Form } from '@storybook/components';

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

const RangeInput = styled.input(base, {
  display: 'table-cell',
  flexGrow: 1,
});
const RangeLabel = styled.span({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});
const RangeWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

class NumberType extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = event => {
    const { onChange } = this.props;
    const { value } = event.target;

    let parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || value === '') {
      parsedValue = null;
    }

    onChange(parsedValue);
  };

  render() {
    const { knob } = this.props;

    return knob.range ? (
      <RangeWrapper>
        <RangeLabel>{knob.min}</RangeLabel>
        <RangeInput
          value={knob.value}
          type="range"
          name={knob.name}
          min={knob.min}
          max={knob.max}
          step={knob.step}
          onChange={this.handleChange}
        />
        <RangeLabel>{`${knob.value} / ${knob.max}`}</RangeLabel>
      </RangeWrapper>
    ) : (
      <Form.Input
        value={knob.value}
        type="number"
        name={knob.name}
        min={knob.min}
        max={knob.max}
        step={knob.step}
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}

NumberType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    range: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

NumberType.serialize = value => (value === null || value === undefined ? '' : String(value));
NumberType.deserialize = value => (value === '' ? null : parseFloat(value));

export default NumberType;
