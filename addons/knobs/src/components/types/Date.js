import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Form } from '@storybook/components';

const FlexSpaced = styled.div({
  flex: 1,
  display: 'flex',
  '& > *': {
    marginLeft: 10,
  },
  '& > *:first-child': {
    marginLeft: 0,
  },
});
const FlexInput = styled(Form.Input)({ flex: 1 });

const formatDate = date => {
  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};
const formatTime = date => {
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
};

class DateType extends Component {
  static getDerivedStateFromProps() {
    return { valid: true };
  }

  state = {
    valid: undefined,
  };

  componentDidUpdate() {
    const { knob } = this.props;
    const { valid } = this.state;
    const value = new Date(knob.value);

    if (valid !== false) {
      this.dateInput.value = formatDate(value);
      this.timeInput.value = formatTime(value);
    }
  }

  onDateChange = e => {
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

  onTimeChange = e => {
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
          ref={el => {
            this.dateInput = el;
          }}
          id={`${name}date`}
          onChange={this.onDateChange}
        />
        <FlexInput
          type="time"
          id={`${name}time`}
          ref={el => {
            this.timeInput = el;
          }}
          onChange={this.onTimeChange}
        />
        {!valid ? <div>invalid</div> : null}
      </FlexSpaced>
    ) : null;
  }
}

DateType.defaultProps = {
  knob: {},
  onChange: value => value,
};

DateType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

DateType.serialize = value => new Date(value).getTime() || new Date().getTime();
DateType.deserialize = value => new Date(value).getTime() || new Date().getTime();

export default DateType;
