import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { styled } from '@storybook/react-native-theming';

import { inputStyle } from './common';

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  ...inputStyle(theme),
}));

const Label = styled.Text(({ theme }) => ({
  fontSize: theme.inputs.text.fontSize,
  color: theme.inputs.text.textColor,
}));

// TODO seconds support
class DateType extends PureComponent {
  constructor() {
    super();
    this.state = {
      isDateVisible: false,
      isTimeVisible: false,
    };
  }

  showDatePicker = () => {
    this.setState({ isDateVisible: true });
  };

  showTimePicker = () => {
    this.setState({ isTimeVisible: true });
  };

  hidePicker = () => {
    this.setState({ isDateVisible: false, isTimeVisible: false });
  };

  onDatePicked = (date) => {
    const value = date.valueOf();
    const { onChange } = this.props;
    onChange(value);
    this.hidePicker();
  };

  render() {
    const { knob } = this.props;

    const { isTimeVisible, isDateVisible } = this.state;
    let d = new Date(knob.value);
    if (isNaN(d.valueOf())) {
      d = new Date();
    }

    // https://stackoverflow.com/a/30272803
    const dateString = [
      `0${d.getDate()}`.slice(-2),
      `0${d.getMonth() + 1}`.slice(-2),
      d.getFullYear(),
    ].join('-');
    const timeString = `${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(-2)}`;

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Touchable onPress={this.showDatePicker}>
            <Label>{dateString}</Label>
          </Touchable>
          <Touchable style={{ marginLeft: 4 }} onPress={this.showTimePicker}>
            <Label>{timeString}</Label>
          </Touchable>
        </View>
        <DateTimePicker
          date={d}
          isVisible={isTimeVisible || isDateVisible}
          mode={isTimeVisible ? 'time' : 'date'}
          onConfirm={this.onDatePicked}
          onCancel={this.hidePicker}
        />
      </View>
    );
  }
}
DateType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

DateType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

DateType.serialize = (value) => String(value);
DateType.deserialize = (value) => parseFloat(value);

export default DateType;
