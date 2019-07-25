import PropTypes from 'prop-types';
import React, { Component, ChangeEvent, Validator } from 'react';

import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

type TextTypeKnobValue = string;
export type TextTypeKnob = KnobControlConfig<TextTypeKnobValue>;
type TextTypeProps = KnobControlProps<TextTypeKnobValue>;

export default class TextType extends Component<TextTypeProps> {
  static defaultProps: TextTypeProps = {
    knob: {} as any,
    onChange: value => value,
  };

  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }) as Validator<TextTypeProps['knob']>,
    onChange: PropTypes.func as Validator<TextTypeProps['onChange']>,
  };

  static serialize = (value: TextTypeKnobValue) => value;

  static deserialize = (value: TextTypeKnobValue) => value;

  shouldComponentUpdate(nextProps: TextTypeProps) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = this.props;
    const { value } = event.target;

    onChange(value);
  };

  render() {
    const { knob } = this.props;

    return (
      <Form.Textarea
        id={knob.name}
        name={knob.name}
        value={knob.value}
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}
