import { Explorer } from './Explorer';
import { mockDataset } from './mockdata';
import type { RefType } from './types';
import { View } from 'react-native';

export default {
  component: Explorer,
  title: 'UI/Sidebar/Explorer',
  parameters: { layout: 'fullscreen', theme: 'side-by-side' },
  decorators: [
    (storyFn: any) => <View style={{ paddingHorizontal: 20 }}>{storyFn()}</View>,
    (storyFn: any) => <View style={{ paddingHorizontal: 20 }}>{storyFn()}</View>,
  ],
};

const selected = {
  refId: 'storybook_internal',
  storyId: 'root-1-child-a2--grandchild-a1-1',
};

const simple: Record<string, RefType> = {
  storybook_internal: {
    title: undefined,
    id: 'storybook_internal',
    url: 'iframe.html',
    previewInitialized: true,
    // @ts-expect-error (invalid input)
    index: mockDataset.withRoot,
  },
};

export const Simple = () => (
  <Explorer
    dataset={{ hash: simple, entries: Object.entries(simple) }}
    selected={selected}
    isLoading={false}
    isBrowsing
    setSelection={() => {}}
  />
);
