import React from 'react';
import Datetime from 'react-datetime';
import insertCss from 'insert-css';
import style from './styles';

const customStyle = `
  .rdt input {
    outline: 0;
    width: 300px;
    border: 1px solid #f7f4f4;
    borderRadius: 2px;
    fontSize: 11px;
    padding: 5px;
    color: #555;
  }
`;

insertCss(style);
insertCss(customStyle);

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
