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

export const Playground: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: '',
    error: '',
  },
};

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
