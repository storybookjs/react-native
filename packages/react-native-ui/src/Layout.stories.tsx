import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { mockDataset } from './mockdata';
import { Text, View } from 'react-native';
import { decorators } from './decorators';

const meta = {
  component: Layout,
  decorators,
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: function Render(args) {
    return (
      <Layout {...args}>
        <Text>Testing</Text>
      </Layout>
    );
  },
  args: {
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};

export const OverflowSidebarExample: Story = {
  render: function Render(args) {
    return (
      <Layout {...args}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'lightgreen',
            alignItems: 'flex-end',
            left: '-50%',
          }}
        >
          <Text style={{ width: '50%', textAlign: 'right' }}>
            This box should not overflow the side navigation in desktop mode
          </Text>
        </View>
      </Layout>
    );
  },
  args: {
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};

export const OverflowAddonsExample: Story = {
  render: function Render(args) {
    return (
      <Layout {...args}>
        <View
          style={{
            height: '100%',
            backgroundColor: 'lightgreen',
            bottom: '-50%',
          }}
        >
          <Text style={{ height: '50%' }}>This box should not overflow the addons panel</Text>
        </View>
      </Layout>
    );
  },
  args: {
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};
