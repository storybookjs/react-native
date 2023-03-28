import { ComponentMeta, ComponentStoryObj } from '@storybook/react';

import { MyButton } from './SelectWithNumber';

export default {
  component: MyButton,
} as ComponentMeta<typeof MyButton>;

export const Basic: ComponentStoryObj<typeof MyButton> = {
  args: {},
};
