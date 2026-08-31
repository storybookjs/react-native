import type { Meta, StoryObj } from '@storybook/react-native';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
