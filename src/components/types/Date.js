import React from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';
import './Date.css';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '100%',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
};

class DateType extends React.Component {
  render() {
    const { knob, onChange } = this.props;
    return (
      <Datetime
        id={knob.name}
        value={new Date(knob.value)}
        type="date"
        onChange={(date) => onChange(date.toISOString())}
      />
    );
  }
}

DateType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

DateType.serialize = function (value) {
  return value;
};

DateType.deserialize = function (value) {
  return value;
};

export default DateType;
