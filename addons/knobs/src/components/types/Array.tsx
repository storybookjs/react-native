import PropTypes from 'prop-types';
import React, { ChangeEvent, Component, Validator } from 'react';

import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

export type ArrayTypeKnobValue = string[] | readonly string[];

export interface ArrayTypeKnob extends KnobControlConfig<ArrayTypeKnobValue> {
  separator: string;
}

interface ArrayTypeProps extends KnobControlProps<ArrayTypeKnobValue> {
  knob: ArrayTypeKnob;
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

  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.array,
      separator: PropTypes.string,
    }) as Validator<ArrayTypeProps['knob']>,
    onChange: PropTypes.func as Validator<ArrayTypeProps['onChange']>,
  };

  static serialize = (value: ArrayTypeKnobValue) => value;

  static deserialize = (value: string[]) => {
    if (Array.isArray(value)) return value;

    return Object.keys(value)
      .sort()
      .reduce((array, key) => [...array, value[key]], []);
  };

  shouldComponentUpdate(nextProps: Readonly<ArrayTypeProps>) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
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
