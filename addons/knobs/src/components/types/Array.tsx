import PropTypes from 'prop-types';
import React, { Component, WeakValidationMap } from 'react';

import { Form } from '@storybook/components';

type ArrayTypeKnobValue = string[];

export interface ArrayTypeKnob {
  name: string;
  value: ArrayTypeKnobValue;
  separator: string;
}

interface ArrayTypeProps {
  knob: ArrayTypeKnob;
  onChange: (value: ArrayTypeKnobValue) => ArrayTypeKnobValue;
}

function formatArray(value: string, separator: string) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

export default class ArrayType extends Component<ArrayTypeProps> {
  static defaultProps: Partial<ArrayTypeProps> = {
    knob: {} as any,
    onChange: (value: ArrayTypeKnobValue) => value,
  };

  static propTypes: WeakValidationMap<ArrayTypeProps> = {
    // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.array,
      separator: PropTypes.string,
    }) as any,
    onChange: PropTypes.func,
  };

  static serialize = (value: ArrayTypeKnobValue) => value;

  static deserialize = (value: ArrayTypeKnobValue) => {
    if (Array.isArray(value)) return value;

    return Object.keys(value)
      .sort()
      .reduce((array, key) => [...array, value[key]], []);
  };

  shouldComponentUpdate(nextProps: Readonly<ArrayTypeProps>) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = (e: Event) => {
    const { knob, onChange } = this.props;
    const { value } = e.target as HTMLTextAreaElement;
    const newVal = formatArray(value, knob.separator);

    onChange(newVal);
  };

  render() {
    const { knob } = this.props;
    const value = knob.value.join(knob.separator);

    return (
      <Form.Textarea
        id={knob.name}
        name={knob.name}
        value={value}
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}
