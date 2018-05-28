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
    const { knob } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Datetime
          id={knob.name}
          value={value ? new Date(value) : null}
          type="date"
          onChange={this.handleChange}
        />
      </div>
    );
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

DateType.serialize = value => String(value);
DateType.deserialize = value => parseFloat(value);

export default DateType;
