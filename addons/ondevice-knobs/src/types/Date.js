import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#f7f4f4',
              borderRadius: 2,
              padding: 5,
            }}
            onPress={this.showDatePicker}
          >
            <Text style={{ fontSize: 13, color: '#555' }}>{dateString}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#f7f4f4',
              borderRadius: 2,
              padding: 5,
              marginLeft: 5,
            }}
            onPress={this.showTimePicker}
          >
            <Text style={{ fontSize: 13, color: '#555' }}>{timeString}</Text>
          </TouchableOpacity>
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
