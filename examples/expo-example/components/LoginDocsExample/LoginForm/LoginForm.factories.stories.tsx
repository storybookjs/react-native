import preview from '../../../.rnstorybook/preview';
import { fn } from 'storybook/test';
import { LoginForm } from './LoginForm';

const meta = preview.meta({
  component: LoginForm,
  args: {
    onSubmit: fn(),
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    submitButtonTitle: 'Sign In',
  },
});

export default meta;

export const Default = meta.story({});

export const WithErrors = meta.story({
  args: {
    emailError: 'Please enter a valid email',
    passwordError: 'Password must be at least 8 characters',
  },
});

export const Loading = meta.story({
  args: {
    loading: true,
  },
});

export const EmailErrorOnly = meta.story({
  args: {
    emailError: 'This email is already registered',
  },
});

export const PasswordErrorOnly = meta.story({
  args: {
    passwordError: 'Password is incorrect',
  },
});

export const LongErrors = meta.story({
  args: {
    emailError:
      'The email address you entered is not valid. Please check the format and try again.',
    passwordError:
      'Your password must be at least 8 characters long and contain both letters and numbers for security.',
  },
});
