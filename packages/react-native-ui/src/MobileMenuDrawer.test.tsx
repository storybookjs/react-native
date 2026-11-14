import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { act, render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text } from 'react-native';
import { MobileMenuDrawer, type MobileMenuDrawerRef } from './MobileMenuDrawer';
import { SelectedNodeProvider } from './SelectedNodeProvider';

// The mock shipped with @gorhom/bottom-sheet renders the sheet's children and drops its props.
// Render it as a host View instead, so the accessibility props Storybook passes end up in the
// tree, and settle on the requested index right away, as the real sheet reports through
// `onChange` once its animation ends. The handle and default background are the library's real
// components, rendered where the real sheet renders them.
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View: MockView } = require('react-native');
  const actual = jest.requireActual('@gorhom/bottom-sheet/mock');
  const source = '@gorhom/bottom-sheet/src/components';
  const BottomSheetHandle = jest.requireActual(`${source}/bottomSheetHandle`).BottomSheetHandle;
  const { BottomSheetBackground } = jest.requireActual(
    `${source}/bottomSheetBackground/BottomSheetBackground`
  );
  // The real backdrop needs the sheet's internal context, so stand in with a host View that
  // applies the library's own accessibility defaults.
  const backdropDefaults = jest.requireActual(`${source}/bottomSheetBackdrop/constants`);
  const BottomSheetBackdrop = ({
    accessible = backdropDefaults.DEFAULT_ACCESSIBLE,
    accessibilityRole = backdropDefaults.DEFAULT_ACCESSIBILITY_ROLE,
    accessibilityLabel = backdropDefaults.DEFAULT_ACCESSIBILITY_LABEL,
  }) =>
    React.createElement(MockView, {
      accessible: accessible ?? undefined,
      accessibilityRole: accessibilityRole ?? undefined,
      accessibilityLabel: accessibilityLabel ?? undefined,
    });

  const animatedIndex = { value: 1, get: () => 1 };
  const animatedPosition = { value: 0, get: () => 0 };

  const BottomSheet = React.forwardRef(function BottomSheet(
    {
      children,
      onChange,
      backdropComponent: Backdrop,
      handleComponent: Handle = BottomSheetHandle,
      backgroundComponent: Background = BottomSheetBackground,
      ...props
    },
    ref
  ) {
    React.useImperativeHandle(ref, () => ({
      snapToIndex: (index) => onChange?.(index),
      close: () => onChange?.(-1),
    }));

    return React.createElement(
      MockView,
      null,
      Backdrop && React.createElement(Backdrop, { animatedIndex, animatedPosition }),
      React.createElement(Background, { animatedIndex, animatedPosition, pointerEvents: 'none' }),
      React.createElement(Handle, { animatedIndex, animatedPosition }),
      React.createElement(MockView, { testID: 'menu-sheet', ...props }, children)
    );
  });

  return {
    ...actual,
    __esModule: true,
    default: BottomSheet,
    BottomSheetHandle,
    BottomSheetBackdrop,
  };
});

const renderMenuDrawer = async () => {
  const ref = createRef<MobileMenuDrawerRef>();

  await render(
    <ThemeProvider theme={theme}>
      <SelectedNodeProvider>
        <MobileMenuDrawer ref={ref}>
          <Text>Story row</Text>
        </MobileMenuDrawer>
      </SelectedNodeProvider>
    </ThemeProvider>
  );

  return ref;
};

const setMenuOpen = async (ref: React.RefObject<MobileMenuDrawerRef | null>, open: boolean) => {
  await act(async () => {
    ref.current?.setMobileMenuOpen(open);
  });
};

describe('MobileMenuDrawer', () => {
  it('does not turn the sheet into one accessibility element, so iOS exposes the story list', async () => {
    const ref = await renderMenuDrawer();
    await setMenuOpen(ref, true);

    // @gorhom/bottom-sheet defaults to accessible with an "adjustable" role and a
    // "Bottom Sheet" label, and on iOS an accessible view hides its children, which collapses
    // the whole story list into a single element.
    // @see https://github.com/storybookjs/react-native/issues/942
    expect(screen.getByTestId('menu-sheet')).toHaveProp('accessible', false);
    expect(screen.getByText('Story row')).toBeOnTheScreen();
  });

  it('leaves no empty "Bottom Sheet" elements from the handle, background or backdrop', async () => {
    const ref = await renderMenuDrawer();
    await setMenuOpen(ref, true);

    // The library labels each of these as an accessible element with no action behind it, and
    // its default background hardcodes that.
    expect(
      screen.queryAllByLabelText(/bottom sheet/i, { includeHiddenElements: true })
    ).toHaveLength(0);
  });

  it('keeps the story list out of the accessibility tree while the sheet is closed', async () => {
    const ref = await renderMenuDrawer();

    // The sheet stays mounted when it is closed, so without this VoiceOver reaches the rows
    // rendered off-screen.
    // @see https://github.com/storybookjs/react-native/issues/942
    expect(screen.queryByText('Story row')).toBeNull();
    expect(screen.getByText('Story row', { includeHiddenElements: true })).toBeOnTheScreen();

    await setMenuOpen(ref, true);
    expect(screen.getByText('Story row')).toBeOnTheScreen();

    await setMenuOpen(ref, false);
    expect(screen.queryByText('Story row')).toBeNull();
  });
});
