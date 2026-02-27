import { styled, useTheme } from '@storybook/react-native-theming';
import React, { useCallback, useMemo } from 'react';
import { Keyboard, View, ViewStyle } from 'react-native';
import { useStoryContext } from '../../hooks';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * This is a handler for `onStartShouldSetResponder`, which dismisses the
 * keyboard as a side effect but then responds with `false` to the responder
 * system, so as not to start actually handling the touch.
 *
 * The objective here is to dismiss the keyboard when the story view is tapped,
 * but in a way that won't interfere with presses or swipes. Using a
 * `Touchable...` component as a wrapper will start to handle the touch, which
 * will swallow swipe gestures that should have gone on to a child view, such
 * as `ScrollView`.
 */
function dismissOnStartResponder() {
  Keyboard.dismiss();

  return false;
}

const Text = styled.Text(({ theme }) => ({
  color: theme?.color?.defaultText,
}));

const errorContainerStyle = {
  flex: 1,
  padding: 16,
  alignItems: 'center',
  justifyContent: 'center',
} satisfies ViewStyle;

const layoutStyles = {
  padded: { padding: 8 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  fullscreen: {},
} satisfies Record<string, ViewStyle>;

const StoryView = ({
  useWrapper = true,
  storyBackgroundColor,
}: {
  useWrapper?: boolean;
  storyBackgroundColor?: string;
}) => {
  const context = useStoryContext();

  const id = context?.id;

  const theme = useTheme();

  const containerStyle = useMemo(() => {
    const layout = context?.parameters?.layout;
    const layoutStyle = layout ? layoutStyles[layout] : {};

    return {
      flex: 1,
      backgroundColor: storyBackgroundColor || theme.background?.content,
      overflow: 'hidden',
      ...layoutStyle,
    } satisfies ViewStyle;
  }, [theme.background?.content, context?.parameters?.layout, storyBackgroundColor]);

  const onError = useCallback(() => {
    console.log(`Error rendering story for ${context?.title} ${context?.name}`);
  }, [context?.title, context?.name]);

  if (context && context.unboundStoryFn) {
    const { unboundStoryFn: StoryComponent } = context;

    if (useWrapper) {
      return (
        <View
          style={containerStyle}
          key={id}
          testID={id}
          accessibilityLabel={id}
          importantForAccessibility="no"
          onStartShouldSetResponder={dismissOnStartResponder}
        >
          <ErrorBoundary onError={onError}>
            {StoryComponent && <StoryComponent {...context} />}
          </ErrorBoundary>
        </View>
      );
    }

    return (
      <ErrorBoundary onError={onError}>
        {StoryComponent && <StoryComponent {...context} />}
      </ErrorBoundary>
    );
  }

  return (
    <View style={errorContainerStyle}>
      <Text>Please select a story to preview.</Text>
    </View>
  );
};

export default React.memo(StoryView);
