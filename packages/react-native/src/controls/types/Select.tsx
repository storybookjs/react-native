import { useTheme } from '@storybook/react-native-theming';
import { useMemo } from 'react';
import { Platform, View } from 'react-native';
import { SelectModal } from '../components/SelectModal';
import { Input, inputStyle } from './common';
import { ControlTypes } from '../sharedTypes';

export interface SelectProps {
  arg: {
    name: string;
    value: any;
    options: Array<any> | Record<string, any>;
    control: {
      labels?: Record<string, string>;
    };
    type: ControlTypes;
  };
  onChange: (value: any) => void;
}

const getOptions = (options: SelectProps['arg']['options'], labels?: Record<string, string>) => {
  if (Array.isArray(options)) {
    return options.map((val) => ({ key: val, label: String(labels?.[val] || val) }));
  }

  return Object.keys(options).map((key) => ({
    label: String(key),
    key: options[key],
  }));
};

const SelectType = ({ arg, onChange }: SelectProps) => {
  const { value } = arg;
  const options = useMemo(
    () => getOptions(arg.options, arg.control.labels),
    [arg.control.labels, arg.options]
  );
  const theme = useTheme();

  const active = options.find(({ key }) => value === key);

  const selected = active?.label ?? '';

  if (Platform.OS === 'web') {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const target = event.currentTarget as EventTarget & {
        selectedOptions: ArrayLike<{ value: string }>;
        value: string;
      };

      if (arg.type === 'multi-select') {
        const selectedOptions = Array.from(target.selectedOptions);
        const selectedValues = selectedOptions.map((option) => option.value);
        onChange(selectedValues);
      } else {
        onChange(target.value);
      }
    };

    return (
      <select
        value={value}
        onChange={handleChange}
        multiple={arg.type === 'multi-select'}
        // @ts-ignore
        style={inputStyle({ theme })}
      >
        {options.map(({ label, key }) => (
          <option key={`${label}-${key}`} value={key}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <View>
      {arg.type === 'multi-select' ? (
        <SelectModal options={options} value={value} multiple onChange={onChange}>
          <Input
            editable={false}
            value={
              Array.isArray(value)
                ? value.map((v) => options.find((opt) => opt.key === v)?.label || v).join(', ')
                : String(selected)
            }
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </SelectModal>
      ) : (
        <SelectModal options={options} value={value} onChange={onChange}>
          <Input
            editable={false}
            value={selected}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </SelectModal>
      )}
    </View>
  );
};

export default SelectType;
