import styled from '@emotion/native';
import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { inputStyle } from './common';

export interface DateProps {
  arg: {
    name: string;
    value: Date;
  };
  onChange: (value: Date) => void;
}

const Touchable = styled.TouchableOpacity(({ theme }: any) => ({
  ...inputStyle(theme, false),
}));

const WebInput = styled('input' as any)(({ theme }: any) => ({
  ...inputStyle(theme),
}));

const Label = styled.Text(({ theme }: any) => ({
  fontSize: theme.inputs.text.fontSize,
  color: theme.inputs.text.textColor,
}));

type VisiblePicker = 'date' | 'time' | 'none';
const DateType = ({ onChange, arg: { name, value } }: DateProps) => {
  const [visiblePicker, setVisiblePicker] = useState<VisiblePicker>('none');

  const onDatePicked = (pickedDate: Date) => {
    onChange(pickedDate);
    setVisiblePicker('none');
  };

  const date = useMemo(() => {
    const dateValue = new Date(value);
    if (isNaN(dateValue.valueOf())) {
      return new Date();
    }

    return dateValue;
  }, [value]);

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

  const webDateString = useMemo(
    () =>
      `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${
        date.getDate() + 1
      }`.padStart(2, '0')}T${`${date.getHours()}`.padStart(
        2,
        '0'
      )}:${`${date.getMinutes()}`.padStart(2, '0')}`,

    [date]
  );

  if (Platform.OS === 'web') {
    return (
      <View testID={name}>
        <WebInput
          type="datetime-local"
          value={webDateString}
          onChange={(e) => onChange(new Date(e.target.value))}
        />
      </View>
    );
  }

  return (
    <View testID={name}>
      <View style={styles.row}>
        <Touchable onPress={() => setVisiblePicker('date')}>
          <Label>{dateString}</Label>
        </Touchable>
        <Touchable style={styles.timeTouchable} onPress={() => setVisiblePicker('time')}>
          <Label>{timeString}</Label>
        </Touchable>
      </View>
      <DateTimePicker
        date={date}
        isVisible={visiblePicker !== 'none'}
        mode={visiblePicker === 'none' ? 'date' : visiblePicker}
        onConfirm={onDatePicked}
        onCancel={() => setVisiblePicker('none')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timeTouchable: {
    marginLeft: 5,
  },
  row: { flexDirection: 'row' },
});

DateType.serialize = (value) => String(value);

DateType.deserialize = (value) => parseFloat(value);

export default DateType;
