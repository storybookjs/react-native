import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { act } from 'react';
import { createRoot, type Root } from 'test-renderer';
import { MobileMenuDrawer } from './MobileMenuDrawer';

const bottomSheet = BottomSheet as unknown as jest.Mock;
const scrollView = BottomSheetScrollView as unknown as jest.Mock;

const lastProps = (mock: jest.Mock) => mock.mock.calls[mock.mock.calls.length - 1][0];

const renderMenuDrawer = async () => {
  const root = createRoot();

  await act(async () => {
    root.render(<MobileMenuDrawer>{'story'}</MobileMenuDrawer>);
  });

  return root;
};

const changeSheetIndex = async (root: Root, index: number) => {
  await act(async () => {
    lastProps(bottomSheet).onChange(index);
  });
};

const storyListVisibility = () => {
  const { accessibilityElementsHidden, importantForAccessibility } = lastProps(scrollView);
  return { accessibilityElementsHidden, importantForAccessibility };
};

describe('MobileMenuDrawer', () => {
  beforeEach(() => {
    bottomSheet.mockClear();
    scrollView.mockClear();
  });

  it('renders the story list inside the bottom sheet', async () => {
    const root = await renderMenuDrawer();

    expect(bottomSheet).toHaveBeenCalledTimes(1);
    expect(lastProps(scrollView).children).toBe('story');

    await act(async () => {
      root.unmount();
    });
  });

  it('does not turn the sheet into one accessibility element, so iOS exposes the story list', async () => {
    const root = await renderMenuDrawer();

    // @gorhom/bottom-sheet defaults to accessible with an "adjustable" role and a
    // "Bottom Sheet" label, and on iOS an accessible view hides its children, which collapses
    // the whole story list into a single element.
    // @see https://github.com/storybookjs/react-native/issues/942
    expect(lastProps(bottomSheet)).toMatchObject({
      accessible: false,
      accessibilityLabel: null,
      accessibilityRole: null,
    });

    await act(async () => {
      root.unmount();
    });
  });

  it('keeps the story list out of the accessibility tree while the sheet is closed', async () => {
    const root = await renderMenuDrawer();

    // The sheet stays mounted when it is closed, so without this VoiceOver reaches the rows
    // rendered off-screen.
    // @see https://github.com/storybookjs/react-native/issues/942
    expect(storyListVisibility()).toEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });

    await changeSheetIndex(root, 1);

    expect(storyListVisibility()).toEqual({
      accessibilityElementsHidden: false,
      importantForAccessibility: 'auto',
    });

    await changeSheetIndex(root, -1);

    expect(storyListVisibility()).toEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });

    await act(async () => {
      root.unmount();
    });
  });
});
