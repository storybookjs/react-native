import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../Button/Button';

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  loading?: boolean;
  emailError?: string;
  passwordError?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  submitButtonTitle?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  emailError,
  passwordError,
  emailLabel = 'Email Address',
  emailPlaceholder = 'Enter your email',
  passwordLabel = 'Password',
  passwordPlaceholder = 'Enter your password',
  submitButtonTitle = 'Sign In',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.(email, password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={emailLabel}
        placeholder={emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />
      <TextInput
        label={passwordLabel}
        placeholder={passwordPlaceholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={passwordError}
      />
      <Button
        title={submitButtonTitle}
        onPress={handleSubmit}
        loading={loading}
        disabled={!email || !password}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
});
