import preview from '../../../.rnstorybook/preview';
import { TextInput } from './TextInput';

const meta = preview.meta({
  component: TextInput,
  args: {
    placeholder: 'Enter text...',
  },
});

export default meta;

export const Default = meta.story({});

export const WithLabel = meta.story({
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
});

export const Password = meta.story({
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
  },
});

export const WithError = meta.story({
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
});

export const Filled = meta.story({
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: 'user@example.com',
  },
});

export const Playground = meta.story({
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    value: '',
    error: '',
  },
});

export const LongLabel = meta.story({
  args: {
    label: 'This is a very long label that might wrap to multiple lines and affect layout',
    placeholder: 'Enter text',
  },
});

export const LongErrorMessage = meta.story({
  args: {
    label: 'Email',
    error:
      'This is a very long error message that explains in detail what went wrong and how to fix it',
  },
});

export const EmptyState = meta.story({
  args: {
    label: '',
    placeholder: '',
  },
});
