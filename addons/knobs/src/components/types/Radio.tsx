import React, { Component, Validator } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { KnobControlConfig, KnobControlProps } from './types';

export type RadiosTypeKnobValue = string | number | null | undefined;

export type RadiosTypeOptionsProp<T extends RadiosTypeKnobValue> = Record<string | number, T>;

export interface RadiosTypeKnob extends KnobControlConfig<RadiosTypeKnobValue> {
  options: RadiosTypeOptionsProp<RadiosTypeKnobValue>;
}

interface RadiosTypeProps extends KnobControlProps<RadiosTypeKnobValue>, RadiosWrapperProps {
  knob: RadiosTypeKnob;
}

interface RadiosWrapperProps {
  isInline: boolean;
}

const RadiosWrapper = styled.div<RadiosWrapperProps>(({ isInline }) =>
  isInline
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> * + *': {
          marginLeft: 10,
        },
      }
    : {}
);

const RadioLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

class RadiosType extends Component<RadiosTypeProps> {
  static defaultProps: RadiosTypeProps = {
    knob: {} as any,
    onChange: value => value,
    isInline: false,
  };

  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }) as Validator<RadiosTypeProps['knob']>,
    onChange: PropTypes.func as Validator<RadiosTypeProps['onChange']>,
    isInline: PropTypes.bool as Validator<RadiosTypeProps['isInline']>,
  };

  static serialize = (value: RadiosTypeKnobValue) => value;

  static deserialize = (value: RadiosTypeKnobValue) => value;

  renderRadioButtonList({ options }: RadiosTypeKnob) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderRadioButton(val, val));
    }
    return Object.keys(options).map(key => this.renderRadioButton(key, options[key]));
  }

  renderRadioButton(label: string, value: RadiosTypeKnobValue) {
    const opts = { label, value };
    const { onChange, knob } = this.props;
    const { name } = knob;
    const id = `${name}-${opts.value}`;

    return (
      <div key={id}>
        <input
          type="radio"
          id={id}
          name={name}
          value={opts.value || undefined}
          onChange={e => onChange(e.target.value)}
          checked={value === knob.value}
        />
        <RadioLabel htmlFor={id}>{label}</RadioLabel>
      </div>
    );
  }

  render() {
    const { knob, isInline } = this.props;

    return <RadiosWrapper isInline={isInline}>{this.renderRadioButtonList(knob)}</RadiosWrapper>;
  }
}

export default RadiosType;
