import React, { Component, WeakValidationMap } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

type RadiosTypeKnobValue = string;

export interface RadiosTypeKnob {
  name: string;
  value: RadiosTypeKnobValue;
  defaultValue: RadiosTypeKnobValue;
  options: RadiosTypeOptionsProp;
}

export interface RadiosTypeOptionsProp {
  [key: string]: RadiosTypeKnobValue;
}

interface RadiosTypeProps {
  knob: RadiosTypeKnob;
  isInline: boolean;
  onChange: (value: RadiosTypeKnobValue) => RadiosTypeKnobValue;
}

interface RadiosWrapperProps {
  isInline: boolean;
}

const RadiosWrapper = styled.div(({ isInline }: RadiosWrapperProps) =>
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

  static propTypes: WeakValidationMap<RadiosTypeProps> = {
    // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }) as any,
    onChange: PropTypes.func,
    isInline: PropTypes.bool,
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
          value={opts.value}
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
