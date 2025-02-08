import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { mockDataset } from './mockdata';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LayoutProvider } from './LayoutProvider';

const meta = {
  component: Layout,
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <LayoutProvider>
            <Story />
          </LayoutProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    ),
  ],
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <Text>Testing</Text>,
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};

export const OverflowSidebarExample: Story = {
  args: {
    children: (
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
    ),
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};

export const OverflowAddonsExample: Story = {
  args: {
    children: (
      <View
        style={{
          height: '100%',
          backgroundColor: 'lightgreen',
          bottom: '-50%',
        }}
      >
        <Text style={{ height: '50%' }}>This box should not overflow the addons panel</Text>
      </View>
    ),
    //@ts-ignore
    storyHash: mockDataset.withRoot,
    storyId: 'emails-buildnotification--with-changes',
  },
};
