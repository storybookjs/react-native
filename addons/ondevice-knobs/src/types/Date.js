import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styled from '@emotion/native';

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  borderColor: theme.borderColor,
  borderWidth: 1,
  borderRadius: 2,
  padding: 5,
}));

const Label = styled.Text(({ theme }) => ({
  fontSize: 13,
  color: theme.labelColor,
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

  onDatePicked = date => {
    const value = date.valueOf();
    const { onChange } = this.props;
    onChange(value);
    this.hidePicker();
  };

  render() {
    const { knob } = this.props;

    const { isTimeVisible, isDateVisible } = this.state;
    const d = new Date(knob.value);

    // https://stackoverflow.com/a/30272803
    const dateString = [
      `0${d.getDate()}`.slice(-2),
      `0${d.getMonth() + 1}`.slice(-2),
      d.getFullYear(),
    ].join('-');
    const timeString = `${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(-2)}`;

    return (
      <View style={{ margin: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <Touchable onPress={this.showDatePicker}>
            <Label>{dateString}</Label>
          </Touchable>
          <Touchable
            style={{
              marginLeft: 5,
            }}
            onPress={this.showTimePicker}
          >
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
