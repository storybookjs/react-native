import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeScreen } from '@storybook/react-native/NativeEvents';
import { expect, fn } from 'storybook/test';
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

export const InteractiveLogin: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ args }) => {
    const screen = new NativeScreen();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find and tap the email input field by placeholder
    const emailInput = await screen.getByPlaceholder('Enter your email');
    await emailInput.tap();

    // Type email address
    await emailInput.type('user@example.com');

    // Find and tap the password input field by placeholder
    const passwordInput = await screen.getByPlaceholder('Enter your password');
    await passwordInput.tap();

    // Type password
    await passwordInput.type('securePassword123');

    // Find and tap the sign in button by text
    const signInButton = await screen.getByText('Sign In');
    await signInButton.tap();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify that onSubmit was called with the correct arguments
    expect(args.onSubmit).toHaveBeenCalledWith('user@example.com', 'securePassword123');
  },
};
