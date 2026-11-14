import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Reanimated from 'react-native-reanimated';
import { MobileAddonsPanel } from './MobileAddonsPanel';
import { BottomSheetBackdropComponent } from './MobileMenuDrawer';

// The manager API is Storybook's browser runtime, not part of the on-device environment; the
// panel only needs it to list the registered addon panels.
jest.mock('storybook/manager-api', () => ({
  addons: { getElements: () => ({}) },
}));

type Worklet = { __closure?: unknown[] };

// The worklets babel plugin records everything a worklet references in `__closure`, and Worklets
// copies those values to the UI runtime. `Platform` can't be copied: its getters call into native
// modules, and on React Native 0.87 with react-native-worklets 0.12 the copy throws ("Trying to
// convert a cyclic object to a serializable"), which crashes the on-device UI on launch.
// @see https://github.com/storybookjs/react-native/issues/935
const expectNoPlatformCapture = (worklet: Worklet) => {
  expect(worklet.__closure).toBeDefined();
  expect(worklet.__closure).not.toContain(Platform);
};

describe('worklets', () => {
  let animatedStyle: jest.SpyInstance;

  beforeEach(() => {
    animatedStyle = jest.spyOn(Reanimated, 'useAnimatedStyle');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderedWorklets = (): Worklet[] => animatedStyle.mock.calls.map(([worklet]) => worklet);

  it('does not capture Platform in the menu backdrop style', async () => {
    await render(
      <BottomSheetBackdropComponent
        animatedIndex={{ value: 0 } as Reanimated.SharedValue<number>}
        animatedPosition={{ value: 0 } as Reanimated.SharedValue<number>}
        style={{}}
      />
    );

    expect(renderedWorklets()).not.toHaveLength(0);
    renderedWorklets().forEach(expectNoPlatformCapture);
  });

  it('does not capture Platform in the addons panel size style', async () => {
    await render(
      <GestureHandlerRootView>
        <ThemeProvider theme={theme}>
          <MobileAddonsPanel storyId="button--primary" />
        </ThemeProvider>
      </GestureHandlerRootView>
    );

    expect(renderedWorklets()).not.toHaveLength(0);
    renderedWorklets().forEach(expectNoPlatformCapture);
  });
});
