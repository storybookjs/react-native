import { act } from 'react';
import { Platform } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { createRoot } from 'test-renderer';
import { MobileAddonsPanel } from './MobileAddonsPanel';

const animatedStyle = useAnimatedStyle as unknown as jest.Mock;
const platform = Platform as { OS: string };

// shared value, then the window height from the react-native mock and the bottom inset from
// __mocks__/react-native-safe-area-context.js
const deps = [expect.any(Object), 844, 34];

const renderPanel = async () => {
  const root = createRoot();

  await act(async () => {
    root.render(<MobileAddonsPanel storyId="button--primary" />);
  });

  return root;
};

const depsArgument = () => animatedStyle.mock.calls[0][1];

describe('MobileAddonsPanel', () => {
  const originalOS = platform.OS;

  afterEach(() => {
    platform.OS = originalOS;
    animatedStyle.mockClear();
  });

  it.each(['ios', 'android'])(
    'does not pass dependencies to useAnimatedStyle on %s',
    async (os) => {
      platform.OS = os;
      const root = await renderPanel();

      expect(animatedStyle).toHaveBeenCalled();
      expect(depsArgument()).toBeUndefined();

      await act(async () => {
        root.unmount();
      });
    }
  );

  it('passes dependencies to useAnimatedStyle on web', async () => {
    platform.OS = 'web';
    const root = await renderPanel();

    // web builds without the worklets babel plugin only recompute the style when deps change
    expect(depsArgument()).toEqual(deps);

    await act(async () => {
      root.unmount();
    });
  });
});
