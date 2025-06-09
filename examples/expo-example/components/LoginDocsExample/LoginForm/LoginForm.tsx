import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../Button/Button';

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  loading?: boolean;
  emailError?: string;
  passwordError?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  emailError,
  passwordError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.(email, password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
      />
      <TextInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={passwordError}
      />
      <Button
        title="Sign In"
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
