import { StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  input: { borderColor: 'darkgrey', borderWidth: 1, padding: 8, borderRadius: 4 },
});

export type InputProps = {
  placeholder?: string;
  borderColor?: string;
  onChangeText?: (text: string) => void;
  defaultValue?: string;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
};

export const Input = ({
  placeholder,
  borderColor = 'darkgrey',
  onChangeText,
  defaultValue,
  keyboardType,
}: InputProps) => {
  return (
    <TextInput
      style={[styles.input, { borderColor }]}
      placeholder={placeholder}
      underlineColorAndroid={'transparent'}
      onChangeText={onChangeText}
      defaultValue={defaultValue}
      keyboardType={keyboardType}
    />
  );
};
