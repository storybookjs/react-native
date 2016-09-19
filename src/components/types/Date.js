import React from 'react';
import Datetime from 'react-datetime';
import insertCss from 'insert-css';
import style from './Date-style';

insertCss(style);

class DateType extends React.Component {
  render() {
    const { knob, onChange } = this.props;
    return (
      <Datetime
        id={knob.name}
        value={new Date(knob.value)}
        type="date"
        onChange={(date) => onChange(date.valueOf())}
      />
    );
  }
}

DateType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

DateType.serialize = function (value) {
  return String(value);
};

DateType.deserialize = function (value) {
  return parseFloat(value);
};

export default DateType;
