import { Heading } from './Text';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: Heading,
  args: { text: 'Hello world!' },
});

export default meta;

export const Basic = meta.story({});
