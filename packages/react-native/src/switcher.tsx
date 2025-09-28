import { memo, useState } from 'react';

export interface SwitcherOptions {
  /** Function to require the storybook
   * @example
   *  requireStorybook: () => require('./.rnstorybook'),
   */
  requireStorybook: () => { default: () => JSX.Element };
  /** Whether storybook is enabled or not. This can also be set via the `EXPO_PUBLIC_STORYBOOK_ENABLED` or `STORYBOOK_ENABLED` environment variable */
  enabled?: boolean;
  /** An optional alternate component to render when storybook is not enabled
   * @example
   *  Alternate: ()=> <App />,
   */
  Alternate?: React.ComponentType<any>;
}

/** A component that switches between rendering Storybook or an alternate component based on the `enabled` prop or environment variables.
 *
 * @param options.requireStorybook - A function that requires and returns the Storybook component.
 * @param options.enabled - Optional boolean to explicitly enable Storybook. If not provided, it checks the `EXPO_PUBLIC_STORYBOOK_ENABLED` or `STORYBOOK_ENABLED` environment variables.
 * @param options.Alternate - An optional React component to render when Storybook is not enabled.
 *
 * @returns The Storybook component if enabled, otherwise the Alternate component or an empty fragment.
 *
 * @example
 * ```tsx
 * import {StorybookSwitcher} from '@storybook/react-native/switcher';
 * import App from './App';
 *
 * export default StorybookSwitcher({
 *   requireStorybook: () => require('./.rnstorybook'),
 *   Alternate: App,
 *   enabled: process.env.myCustomFlag,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Using environment variables to control Storybook
 * import {StorybookSwitcher} from '@storybook/react-native/switcher';
 *
 * export default StorybookSwitcher({
 *   requireStorybook: () => require('./.rnstorybook'),
 * });
 * ```
 */
export const storybookSwitcher = ({ enabled, requireStorybook, Alternate }: SwitcherOptions) => {
  const shouldBeEnabled =
    enabled !== undefined
      ? enabled
      : process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true' ||
        process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === '1' ||
        process.env.STORYBOOK_ENABLED === 'true' ||
        process.env.STORYBOOK_ENABLED === '1';

  if (shouldBeEnabled) {
    return requireStorybook().default;
  }

  if (Alternate) {
    return Alternate;
  }

  return function Fallback() {
    return <></>;
  };
};

/**
 * A memoized component that switches between rendering Storybook or an alternate component based on the `enabled` prop or environment variables.
 * only the enabled prop is checked for changes to avoid unnecessary re-renders.
 *
 * @param props.requireStorybook - A function that requires and returns the Storybook component.
 * @param props.enabled - Optional boolean to explicitly enable Storybook. If not provided, it checks the `EXPO_PUBLIC_STORYBOOK_ENABLED` or `STORYBOOK_ENABLED` environment variables.
 * @param props.Alternate - An optional React component to render when Storybook is not enabled.
 *
 * @returns The Storybook component if enabled, otherwise the Alternate component or an empty fragment.
 *
 * @example
 * ```tsx
 * import {StorybookSwitcher} from '@storybook/react-native/switcher';
 *
 * export default function App() {
 *   const [isStorybookEnabled, setIsStorybookEnabled] = useState(false);
 *   return (
 *     <StorybookSwitcher
 *       requireStorybook={() => require('./.rnstorybook')}
 *       enabled={isStorybookEnabled}
 *       Alternate={() => (
 *         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 *           <Text>{'Storybook is not enabled'}</Text>
 *
 *           <Pressable onPress={() => setIsStorybookEnabled(true)}>
 *             <Text>{'Enable Storybook'}</Text>
 *           </Pressable>
 *         </View>
 *       )}
 *    />
 *  );
 *}
 *
 * ```
 */
export const StorybookSwitcher = memo(
  function StorybookSwitcher({
    requireStorybook,
    Alternate,
    enabled,
  }: {
    requireStorybook: () => { default: () => JSX.Element };
    Alternate?: React.ComponentType<any>;
    enabled?: boolean;
  }) {
    const shouldBeEnabled =
      enabled !== undefined
        ? enabled
        : process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true' ||
          process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === '1' ||
          process.env.STORYBOOK_ENABLED === 'true' ||
          process.env.STORYBOOK_ENABLED === '1';

    let [StorybookRender, setStorybookRender] = useState<null | JSX.Element>(null);

    if (shouldBeEnabled) {
      if (StorybookRender === null) {
        const Component = requireStorybook().default;

        setStorybookRender(<Component />);
      }

      return StorybookRender;
    }

    if (Alternate) {
      return <Alternate />;
    }

    return <></>;
  },
  (prev, next) => {
    if (prev.enabled !== next.enabled) return false;

    return true;
  }
);
