import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import Datetime from 'react-datetime';

import style from './styles';

const DateInput = styled(Datetime)(style);

class DateType extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      return { value: props.knob.value };
    }
    return null;
  }

  handleChange = date => {
    const value = date.valueOf();
    this.setState({ value });

    this.props.onChange(value);
  };

  render() {
    const { value } = this.state;

    return (
      <DateInput
        value={value ? new Date(value) : null}
        type="date"
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}

DateType.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

DateType.serialize = value => String(value);
DateType.deserialize = value => parseFloat(value);

export default DateType;
