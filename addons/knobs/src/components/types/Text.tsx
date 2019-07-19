import PropTypes from 'prop-types';
import React, { Component, ChangeEvent, WeakValidationMap } from 'react';

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

  static propTypes: WeakValidationMap<TextTypeProps> = {
    // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }) as any,
    onChange: PropTypes.func,
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
