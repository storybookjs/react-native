import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import Datetime from 'react-datetime';

import style from './styles';

const DateInput = styled(Datetime)(style);

class DateType extends React.PureComponent {
  handleChange = date => {
    const value = date.valueOf();
    this.props.onChange(value);
  };

  render() {
    const { knob } = this.props;

    return (
      <DateInput
        value={knob.value ? new Date(knob.value) : null}
        type="date"
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}

DateType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

DateType.serialize = value => String(value);
DateType.deserialize = value => parseFloat(value);

export default DateType;
