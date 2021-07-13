import styled from '@emotion/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

export interface DateProps {
  arg: {
    name: string;
    value: Date;
  };
  onChange: (value: Date) => void;
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

const DateType = ({ onChange, arg: { name, value } }: DateProps) => {
  const [isDateVisible, setIsDateVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);

  const showDatePicker = () => {
    setIsDateVisible(true);
  };

  const showTimePicker = () => {
    setIsTimeVisible(true);
  };

  const hidePicker = () => {
    setIsDateVisible(false);
    setIsTimeVisible(false);
  };

  const onDatePicked = (pickedDate) => {
    // const dateValue = pickedDate.valueOf();
    onChange(pickedDate);
    hidePicker();
  };

  const date = useMemo(() => new Date(value), [value]);

  // https://stackoverflow.com/a/30272803
  const dateString = useMemo(
    () =>
      [
        `0${date.getDate()}`.slice(-2),
        `0${date.getMonth() + 1}`.slice(-2),
        date.getFullYear(),
      ].join('-'),
    [date]
  );
  const timeString = useMemo(
    () => `${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)}`,
    [date]
  );

  return (
    <View testID={name} style={styles.spacing}>
      <View style={styles.row}>
        <Touchable onPress={showDatePicker}>
          <Label>{dateString}</Label>
        </Touchable>
        <Touchable style={styles.timeTouchable} onPress={showTimePicker}>
          <Label>{timeString}</Label>
        </Touchable>
      </View>
      <DateTimePicker
        date={date}
        isVisible={isTimeVisible || isDateVisible}
        mode={isTimeVisible ? 'time' : 'date'}
        onConfirm={onDatePicked}
        onCancel={hidePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timeTouchable: {
    marginLeft: 5,
  },
  row: { flexDirection: 'row' },
  spacing: { margin: 10 },
});

DateType.serialize = (value) => String(value);

DateType.deserialize = (value) => parseFloat(value);

export default DateType;
