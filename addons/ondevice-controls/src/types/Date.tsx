import React, { PureComponent } from 'react';
import { View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styled from '@emotion/native';

interface DateProps {
  knob: {
    name: string;
    value: number;
  };
  onChange: (value: number) => void;
}

const Touchable = styled.TouchableOpacity(({ theme }: any) => ({
  borderColor: theme.borderColor || '#e6e6e6',
  borderWidth: 1,
  borderRadius: 2,
  padding: 5,
}));

const Label = styled.Text(({ theme }: any) => ({
  fontSize: 13,
  color: theme.labelColor || 'black',
}));

// TODO seconds support
class DateType extends PureComponent<
  DateProps,
  { isTimeVisible: boolean; isDateVisible: boolean }
> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
  };

  static serialize = (value) => String(value);

  static deserialize = (value) => parseFloat(value);

  constructor(props) {
    super(props);
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

export default DateType;
