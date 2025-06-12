import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { LoginForm } from './LoginForm';

const meta = {
  component: LoginForm,
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithErrors: Story = {
  args: {
    emailError: 'Please enter a valid email',
    passwordError: 'Password must be at least 8 characters',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const EmailErrorOnly: Story = {
  args: {
    emailError: 'This email is already registered',
  },
};

export const PasswordErrorOnly: Story = {
  args: {
    passwordError: 'Password is incorrect',
  },
};

export const LongErrors: Story = {
  args: {
    emailError:
      'The email address you entered is not valid. Please check the format and try again.',
    passwordError:
      'Your password must be at least 8 characters long and contain both letters and numbers for security.',
  },
};
