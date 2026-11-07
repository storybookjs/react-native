import { styled, useTheme } from '@storybook/react-native-theming';
import { useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { DateTimePickerModal, type PickerMode } from '../components/DateTimePickerModal';
import { getDateTimePicker, type DateTimePickerModule } from '../optionalNativeModules';
import { Input, inputStyle } from './common';
import {
  formatDateInput,
  formatDateLabel,
  formatDateTimeLocal,
  formatTimeInput,
  parseDateInput,
  parseTimeInput,
  toValidDate,
} from './dateUtils';

export interface DateProps {
  arg: {
    name: string;
    value: Date;
  };
  onChange: (value: Date) => void;
}

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  ...inputStyle({ theme }),
}));

const Label = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1,
  color: theme.input.color,
}));

type ControlProps = { name: string; date: Date; onChange: (value: Date) => void };

/** Uses @react-native-community/datetimepicker: a dialog on Android and a modal sheet on iOS. */
const NativeDateTime = ({
  name,
  date,
  onChange,
  picker,
}: ControlProps & { picker: DateTimePickerModule }) => {
  const [visiblePicker, setVisiblePicker] = useState<PickerMode | 'none'>('none');

  const open = (mode: PickerMode) => {
    if (Platform.OS === 'android') {
      picker.DateTimePickerAndroid.open({
        value: date,
        mode,
        is24Hour: true,
        onChange: (event, picked) => {
          if (event.type === 'set' && picked) onChange(picked);
        },
      });
      return;
    }

    setVisiblePicker(mode);
  };

  return (
    <View testID={name}>
      <View style={styles.row}>
        <Touchable testID={`${name}-date`} onPress={() => open('date')}>
          <Label>{formatDateLabel(date)}</Label>
        </Touchable>
        <Touchable testID={`${name}-time`} style={styles.timeField} onPress={() => open('time')}>
          <Label>{formatTimeInput(date)}</Label>
        </Touchable>
      </View>

      {Platform.OS !== 'android' && (
        <DateTimePickerModal
          Picker={picker.default}
          date={date}
          mode={visiblePicker === 'none' ? 'date' : visiblePicker}
          visible={visiblePicker !== 'none'}
          onConfirm={(picked) => {
            onChange(picked);
            setVisiblePicker('none');
          }}
          onCancel={() => setVisiblePicker('none')}
        />
      )}
    </View>
  );
};

const FallbackField = ({
  testID,
  value,
  placeholder,
  parse,
  onChange,
  style,
}: {
  testID: string;
  value: string;
  placeholder: string;
  parse: (text: string) => Date | null;
  onChange: (value: Date) => void;
  style?: any;
}) => {
  // Uncontrolled like the other text controls; the typed text is only read on commit.
  const text = useRef(value);
  const [focused, setFocused] = useState(false);
  const [hasError, setHasError] = useState(false);

  const commit = () => {
    const parsed = parse(text.current);
    setHasError(parsed === null);
    if (parsed) onChange(parsed);
  };

  return (
    <Input
      testID={testID}
      defaultValue={value}
      placeholder={placeholder}
      onChangeText={(next) => {
        text.current = next;
        if (hasError && parse(next)) setHasError(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onSubmitEditing={commit}
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="numbers-and-punctuation"
      returnKeyType="done"
      underlineColorAndroid="transparent"
      focused={focused}
      hasError={hasError}
      style={[styles.fallbackField, style]}
    />
  );
};

/**
 * Text inputs for the date (YYYY-MM-DD) and time (HH:mm), used when the native date picker isn't
 * installed or linked. A value is applied on blur or submit, and an invalid one shows an error
 * border.
 */
const FallbackDateTime = ({ name, date, onChange }: ControlProps) => {
  const dateValue = formatDateInput(date);
  const timeValue = formatTimeInput(date);
  const commit = (next: Date) => {
    if (next.valueOf() !== date.valueOf()) onChange(next);
  };

  return (
    <View testID={name} style={styles.row}>
      {/* Keyed by the arg so a new value (an edit or a reset) replaces what was typed. */}
      <FallbackField
        key={`date-${dateValue}`}
        testID={`${name}-date`}
        value={dateValue}
        placeholder="YYYY-MM-DD"
        parse={(text) => parseDateInput(text, date)}
        onChange={commit}
      />
      <FallbackField
        key={`time-${timeValue}`}
        testID={`${name}-time`}
        value={timeValue}
        placeholder="HH:mm"
        parse={(text) => parseTimeInput(text, date)}
        onChange={commit}
        style={styles.timeField}
      />
    </View>
  );
};

const DateType = ({ onChange, arg: { name, value } }: DateProps) => {
  const theme = useTheme();

  const date = useMemo(() => toValidDate(value), [value]);

  if (Platform.OS === 'web') {
    return (
      <View testID={name}>
        <input
          type="datetime-local"
          defaultValue={formatDateTimeLocal(date)}
          onChange={(e) => {
            const target = e.currentTarget as EventTarget & { value: string };
            const newDate = new Date(target.value);
            onChange(newDate);
          }}
          // @ts-ignore
          style={inputStyle({ theme })}
        />
      </View>
    );
  }

  const picker = getDateTimePicker();

  if (picker) {
    return <NativeDateTime name={name} date={date} onChange={onChange} picker={picker} />;
  }

  return <FallbackDateTime name={name} date={date} onChange={onChange} />;
};

const styles = StyleSheet.create({
  timeField: {
    marginLeft: 5,
  },
  row: { flexDirection: 'row' },
  fallbackField: { minWidth: 72 },
});

DateType.serialize = (value) => String(value);

DateType.deserialize = (value) => parseFloat(value);

export default DateType;
