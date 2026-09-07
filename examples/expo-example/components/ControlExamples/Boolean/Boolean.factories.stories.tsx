import { Switch } from './Boolean';
import preview from '../../../.rnstorybook/preview';

const meta = preview.meta({
  component: Switch,
});

export default meta;

export const Basic = meta.story({
  args: {
    on: false,
  },
});

export const On = meta.story({ args: { on: true } });
