import { MyButton } from './SelectWithNumber';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: MyButton,
});

export default meta;

export const Basic = meta.story({
  args: {
    number: undefined,
  },
});
