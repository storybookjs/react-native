import PropTypes from 'prop-types';
import React, { Component, ChangeEvent } from 'react';

import { styled } from '@storybook/theming';
import { Form } from '@storybook/components';

type NumberTypeKnobValue = number;

export interface NumberTypeKnobOptions {
  range?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface NumberTypeKnob extends NumberTypeKnobOptions {
  name: string;
  value: number;
}

interface NumberTypeProps {
  knob: NumberTypeKnob;
  onChange: (value: NumberTypeKnobValue) => NumberTypeKnobValue;
}

const RangeInput = styled.input(
  {
    boxSizing: 'border-box',
    height: '25px',
    outline: 'none',
    border: '1px solid #f7f4f4',
    borderRadius: 2,
    fontSize: 11,
    padding: '5px',
    color: '#444',
  },
  {
    display: 'table-cell',
    flexGrow: 1,
  }
);

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

export default class NumberType extends Component<NumberTypeProps> {
  static propTypes = {
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

  static serialize = (value: NumberTypeKnobValue | null | undefined) =>
    value === null || value === undefined ? '' : String(value);

  static deserialize = (value: string) => (value === '' ? null : parseFloat(value));

  shouldComponentUpdate(nextProps: NumberTypeProps) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
