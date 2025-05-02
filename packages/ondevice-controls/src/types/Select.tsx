import { useTheme } from '@storybook/react-native-theming';
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

const getOptions = ({ options, control: { labels } }: SelectProps['arg']) => {
  if (Array.isArray(options)) {
    if (labels) {
      return options.map((val) => ({ key: val, label: labels[val] || val }));
    }
    return options.map((val) => ({ key: val, label: val }));
  }

  return Object.keys(options).map((key) => ({
    label: key,
    key: options[key],
  }));
};

const SelectType = ({ arg, onChange }: SelectProps) => {
  const { value } = arg;
  const options = getOptions(arg);
  const theme = useTheme();

  const active = options.find(({ key }) => value === key);

  const selected = active && active.label;

  if (Platform.OS === 'web') {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (arg.type === 'multi-select') {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const selectedValues = selectedOptions.map((option) => option.value);
        onChange(selectedValues);
      } else {
        onChange(event.target.value);
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
        <SelectModal
          data={options}
          multiselect
          initValue={Array.isArray(value) ? value.map((v) => String(v)) : [String(value)]}
          onChange={(selectedOptions) => {
            if (Array.isArray(selectedOptions)) {
              onChange(selectedOptions.map((option) => option.key));
            }
          }}
          animationType="none"
          keyExtractor={({ key, label }) => `${label}-${key}`}
          selectedSeparator=", "
          closeOnChange={false}
        >
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
        <SelectModal
          data={options}
          initValue={String(value)}
          onChange={(option) => onChange(option.key)}
          animationType="none"
          keyExtractor={({ key, label }) => `${label}-${key}`}
        >
          <Input
            editable={false}
            value={String(selected)}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
          />
        </SelectModal>
      )}
    </View>
  );
};

export default SelectType;
