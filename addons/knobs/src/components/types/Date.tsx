import React, { Component, ChangeEvent, Validator } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

type DateTypeKnobValue = number;
export type DateTypeKnob = KnobControlConfig<DateTypeKnobValue>;
type DateTypeProps = KnobControlProps<DateTypeKnobValue>;

interface DateTypeState {
  valid: boolean | undefined;
}

const FlexSpaced = styled.div({
  flex: 1,
  display: 'flex',
  '&& > *': {
    marginLeft: 10,
  },
  '&& > *:first-of-type': {
    marginLeft: 0,
  },
});
const FlexInput = styled(Form.Input)({ flex: 1 });

const formatDate = (date: Date) => {
  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
};

export default class DateType extends Component<DateTypeProps, DateTypeState> {
  static defaultProps: DateTypeProps = {
    knob: {} as any,
    onChange: value => value,
  };

  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    }) as Validator<DateTypeProps['knob']>,
    onChange: PropTypes.func as Validator<DateTypeProps['onChange']>,
  };

  static serialize = (value: DateTypeKnobValue) =>
    new Date(value).getTime() || new Date().getTime();

  static deserialize = (value: DateTypeKnobValue) =>
    new Date(value).getTime() || new Date().getTime();

  static getDerivedStateFromProps() {
    return { valid: true };
  }

  state: DateTypeState = {
    valid: undefined,
  };

  dateInput!: HTMLInputElement;

  timeInput!: HTMLInputElement;

  componentDidUpdate() {
    const { knob } = this.props;
    const { valid } = this.state;
    const value = new Date(knob.value);

    if (valid !== false) {
      this.dateInput.value = formatDate(value);
      this.timeInput.value = formatTime(value);
    }
  }

  onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { knob, onChange } = this.props;
    const { state } = this;

    let valid = false;
    const [year, month, day] = e.target.value.split('-');
    const result = new Date(knob.value);
    if (result.getTime()) {
      result.setFullYear(parseInt(year, 10));
      result.setMonth(parseInt(month, 10) - 1);
      result.setDate(parseInt(day, 10));
      if (result.getTime()) {
        valid = true;
        onChange(result.getTime());
      }
    }
    if (valid !== state.valid) {
      this.setState({ valid });
    }
  };

  onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { knob, onChange } = this.props;
    const { state } = this;

    let valid = false;
    const [hours, minutes] = e.target.value.split(':');
    const result = new Date(knob.value);
    if (result.getTime()) {
      result.setHours(parseInt(hours, 10));
      result.setMinutes(parseInt(minutes, 10));
      if (result.getTime()) {
        onChange(result.getTime());
        valid = true;
      }
    }
    if (valid !== state.valid) {
      this.setState({ valid });
    }
  };

  render() {
    const { knob } = this.props;
    const { name } = knob;
    const { valid } = this.state;

    return name ? (
      <FlexSpaced style={{ display: 'flex' }}>
        <FlexInput
          type="date"
          max="9999-12-31" // I do this because of a rendering bug in chrome
          ref={(el: HTMLInputElement) => {
            this.dateInput = el;
          }}
          id={`${name}date`}
          name={`${name}date`}
          onChange={this.onDateChange}
        />
        <FlexInput
          type="time"
          id={`${name}time`}
          name={`${name}time`}
          ref={(el: HTMLInputElement) => {
            this.timeInput = el;
          }}
          onChange={this.onTimeChange}
        />
        {!valid ? <div>invalid</div> : null}
      </FlexSpaced>
    ) : null;
  }
}
