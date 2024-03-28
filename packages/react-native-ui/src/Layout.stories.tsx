import { Meta, StoryObj } from '@storybook/react';

import { Layout } from './Layout';
// import { mockDataset } from './mockdata';
// import { index } from './mockdata.large';
import { mockDataset } from './mockdata';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const meta = {
  title: 'components/Layout',
  component: Layout,
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Story />
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
