---
sidebar_position: 4
description: Learn practical development workflows with React Native Storybook through real examples like building a login form from design to implementation.
keywords:
  [
    react native,
    storybook,
    development,
    workflows,
    component development,
    design systems,
    login form,
    iterative development,
  ]
---

# Development Workflows

This guide walks through practical workflows for developing React Native components with Storybook, using real examples to show how Storybook fits into your daily development process.

## Example: Building a Login Form

Let's walk through building a login form to demonstrate a typical Storybook workflow.

### 1. Break Down the Design

You receive a design for a login form. Instead of building it as one large component, break it down:

- `TextInput` - For email and password fields
- `Button` - For the submit button
- `ValidationMessage` - For error states
- `LoginForm` - The complete form that combines everything

### 2. Start with the Smallest Component

Begin with the `TextInput` component since it's used by multiple parts of the form.

#### Create the Component Shell

```typescript
// components/TextInput/TextInput.tsx
import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet } from 'react-native';

interface TextInputProps {
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
```

#### Create the Story

```typescript
// components/TextInput/TextInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { TextInput } from './TextInput';

const meta = {
  component: TextInput,
  args: {
    placeholder: 'Enter text...',
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const Filled: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'user@example.com',
  },
};
```

### 3. Open Storybook and Iterate

Now open Storybook to see your component in action:

If you have a Storybook route in your app for example you could use deep linking

```bash
npx uri-scheme open "myapp://storybook?STORYBOOK_STORY_ID=components-textinput--default" --ios
```

Or just navigate to the TextInput story in your Storybook UI.

### 4. Work Through Different States

Use Storybook to iterate on your component:

1. **Start with Default**: Check basic functionality
2. **Test WithLabel**: Ensure proper spacing and typography
3. **Test Password**: Verify secure text entry works
4. **Test WithError**: Check error styling and layout
5. **Test Filled**: See how it looks with content

Use the Controls addon to experiment with different props without editing code:

```typescript
// Enhanced story with controls
export const Playground: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: '',
    error: '',
  },
};
```

### 5. Refine Based on Feedback

As you work in Storybook, you might notice issues:

- The error state needs better contrast
- The label spacing doesn't match the design
- The placeholder text color is too light

Update your component and see changes instantly thanks to hot reloading.

### 6. Build the Next Component

Once `TextInput` is solid, move to the `Button` component:

```typescript
// components/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#007AFF'} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: 'white' },
  secondaryText: { color: '#007AFF' },
});
```

Create stories for all button states:

```typescript
// components/Button/Button.stories.tsx
export const Primary: Story = {
  args: { title: 'Sign In' },
};

export const Secondary: Story = {
  args: { title: 'Create Account', variant: 'secondary' },
};

export const Loading: Story = {
  args: { title: 'Sign In', loading: true },
};

export const Disabled: Story = {
  args: { title: 'Sign In', disabled: true },
};
```

Test each state:

```bash
# Jump directly to the loading state
npx uri-scheme open "myapp://storybook?STORYBOOK_STORY_ID=components-button--loading" --ios
```

### 7. Compose Components Together

Finally, build the complete login form using your tested components:

```typescript
// components/LoginForm/LoginForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../Button/Button';

interface LoginFormProps {
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
```

Create stories for the complete form:

```typescript
// components/LoginForm/LoginForm.stories.tsx
export const Default: Story = {};

export const WithErrors: Story = {
  args: {
    emailError: 'Please enter a valid email',
    passwordError: 'Password must be at least 8 characters',
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const WithValues: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Pre-fill with demo data
      return <Story />;
    },
  ],
};
```

## Development Workflow Tips

### Work with Multiple Devices

Test your components on different screen sizes, and platforms (iOS/Android) running Storybook on multiple devices.

### Iterate Quickly

1. **Start with basic structure** - Get the component shell working
2. **Add one feature at a time** - Focus on single functionality
3. **Test immediately** - Use Storybook to verify each change
4. **Use Controls** - Experiment with props without code changes
5. **Share early** - Send builds to teammates for feedback

### Handle Edge Cases

Create stories for edge cases you discover:

```typescript
export const LongLabel: Story = {
  args: {
    label: 'This is a very long label that might wrap to multiple lines and affect layout',
    placeholder: 'Enter text',
  },
};

export const LongErrorMessage: Story = {
  args: {
    label: 'Email',
    error:
      'This is a very long error message that explains in detail what went wrong and how to fix it',
  },
};

export const EmptyState: Story = {
  args: {
    label: '',
    placeholder: '',
  },
};
```

## Story-Driven Development Benefits

### Faster Development

- See changes instantly without navigating through your app
- Test edge cases quickly
- Experiment with different props easily

### Better Components

- Forces you to think about all states upfront
- Reveals integration issues early
- Makes components more reusable

### Improved Collaboration

- Designers can see components in all states
- QA can test components in isolation
- Documentation is automatically generated

### Easier Testing

- Components are already isolated
- All states are documented
- Edge cases are covered

## Workflow Patterns

### Bottom-Up Development

1. Start with smallest components (TextInput, Button)
2. Test thoroughly in isolation
3. Compose into larger components (LoginForm)
4. Integrate into pages/screens

### State-First Approach

1. Identify all possible states from design
2. Create stories for each state
3. Implement component to match all stories
4. Refine based on story feedback

### Collaborative Development

1. Share story links in design reviews
2. Get feedback before implementing full features
3. Use stories as acceptance criteria
4. Demo progress using specific story states

This workflow approach helps you build robust, well-tested components while maintaining fast development velocity and good team collaboration.
