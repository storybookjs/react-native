import React, { Component, ChangeEvent, WeakValidationMap } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { KnobControlConfig, KnobControlProps } from './types';

type CheckboxesTypeKnobValue = string[];

export interface CheckboxesTypeKnob extends KnobControlConfig<CheckboxesTypeKnobValue> {
  options: Record<string, string>;
}

interface CheckboxesTypeProps
  extends KnobControlProps<CheckboxesTypeKnobValue>,
    CheckboxesWrapperProps {
  knob: CheckboxesTypeKnob;
}

interface CheckboxesTypeState {
  values: CheckboxesTypeKnobValue;
}

interface CheckboxesWrapperProps {
  isInline: boolean;
}

const CheckboxesWrapper = styled.div(({ isInline }: CheckboxesWrapperProps) =>
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

const CheckboxFieldset = styled.fieldset({
  border: 0,
  padding: 0,
  margin: 0,
});

const CheckboxLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

export default class CheckboxesType extends Component<CheckboxesTypeProps, CheckboxesTypeState> {
  static defaultProps: CheckboxesTypeProps = {
    knob: {} as any,
    onChange: value => value,
    isInline: false,
  };

  static propTypes: WeakValidationMap<CheckboxesTypeProps> = {
    // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.array,
      options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }) as any,
    onChange: PropTypes.func,
    isInline: PropTypes.bool,
  };

  static serialize = (value: CheckboxesTypeKnobValue) => value;

  static deserialize = (value: CheckboxesTypeKnobValue) => value;

  constructor(props: CheckboxesTypeProps) {
    super(props);
    const { knob } = props;

    this.state = {
      values: knob.defaultValue || [],
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const currentValue = (e.target as HTMLInputElement).value;
    const { values } = this.state;

    if (values.includes(currentValue)) {
      values.splice(values.indexOf(currentValue), 1);
    } else {
      values.push(currentValue);
    }

    this.setState({ values });

    onChange(values);
  };

  renderCheckboxList = ({ options }: CheckboxesTypeKnob) =>
    Object.keys(options).map(key => this.renderCheckbox(key, options[key]));

  renderCheckbox = (label: string, value: string) => {
    const { knob } = this.props;
    const { name } = knob;
    const id = `${name}-${value}`;
    const { values } = this.state;

    return (
      <div key={id}>
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          onChange={this.handleChange}
          checked={values.includes(value)}
        />
        <CheckboxLabel htmlFor={id}>{label}</CheckboxLabel>
      </div>
    );
  };

  render() {
    const { knob, isInline } = this.props;

    return (
      <CheckboxFieldset>
        <CheckboxesWrapper isInline={isInline}>{this.renderCheckboxList(knob)}</CheckboxesWrapper>
      </CheckboxFieldset>
    );
  }
}
