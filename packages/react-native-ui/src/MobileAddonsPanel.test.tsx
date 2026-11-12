import { theme, ThemeProvider } from '@storybook/react-native-theming';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Reanimated from 'react-native-reanimated';
import { MobileAddonsPanel } from './MobileAddonsPanel';

// The manager API is Storybook's browser runtime, not part of the on-device environment; the
// panel only needs it to list the registered addon panels.
jest.mock('storybook/manager-api', () => ({
  addons: { getElements: () => ({}) },
}));

const renderPanel = async () => {
  await render(
    <GestureHandlerRootView>
      <ThemeProvider theme={theme}>
        <MobileAddonsPanel storyId="button--primary" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

describe('MobileAddonsPanel', () => {
  let animatedStyle: jest.SpyInstance;

  beforeEach(() => {
    animatedStyle = jest.spyOn(Reanimated, 'useAnimatedStyle');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const depsArgument = () => animatedStyle.mock.calls[0][1];

  it.each(['ios', 'android'] as const)(
    'does not pass dependencies to useAnimatedStyle on %s',
    async (os) => {
      jest.replaceProperty(Platform, 'OS', os);
      await renderPanel();

      expect(animatedStyle).toHaveBeenCalled();
      expect(depsArgument()).toBeUndefined();
    }
  );

  it('passes dependencies to useAnimatedStyle on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await renderPanel();

    // web builds without the worklets babel plugin only recompute the style when deps change:
    // the shared position, the window height and the bottom inset
    expect(depsArgument()).toEqual([
      expect.objectContaining({ value: expect.any(Number) }),
      expect.any(Number),
      expect.any(Number),
    ]);
  });
});
