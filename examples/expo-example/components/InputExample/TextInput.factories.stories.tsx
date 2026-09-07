import preview from '../../.rnstorybook/preview';
import { Input } from './TextInput';

const meta = preview.meta({
  component: Input,
  parameters: {
    notes: 'Use this example to test the software keyboard related issues.',
  },
});

export default meta;

export const Basic = meta.story({
  args: {
    placeholder: 'Type something',
  },
});
