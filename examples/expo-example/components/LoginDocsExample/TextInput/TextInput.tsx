import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet } from 'react-native';

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: { borderColor: '#ff6b6b' },
  error: { color: '#ff6b6b', fontSize: 14, marginTop: 4 },
});
