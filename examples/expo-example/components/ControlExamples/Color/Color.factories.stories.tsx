import { Color } from './Color';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  parameters: { notes: '- test' },
  argTypes: {
    color: {
      control: { type: 'color' },
    },
  },
  component: Color,
});

export default meta;

export const ColorExample = meta.story({
  args: {
    color: '#a819b9',
  },
});
