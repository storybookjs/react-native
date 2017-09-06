import PropTypes from 'prop-types';
import React from 'react';
import Datetime from 'react-datetime';
import insertCss from 'insert-css';
import style from './styles';

const customStyle = `
  .rdt input {
    outline: 0;
    width: 100%;
    border: 1px solid #f7f4f4;
    border-radius: 2px;
    font-size: 11px;
    padding: 5px;
    color: #555;
    display: table-cell;
    box-sizing: border-box;
  }
`;

insertCss(style);
insertCss(customStyle);

const DateType = ({ knob, onChange }) => (
  <div>
    <Datetime
      id={knob.name}
      value={knob.value ? new Date(knob.value) : null}
      type="date"
      onChange={date => onChange(date.valueOf())}
    />
  </div>
);

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

DateType.serialize = value => String(value);
DateType.deserialize = value => parseFloat(value);

export default DateType;
