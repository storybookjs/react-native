import React from 'react';

import { Text, Keyboard } from 'react-native';
import { useStoryContext, useTheme } from '../../../hooks';
import { Box } from '../Shared/layout';

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

const StoryView = () => {
  const context = useStoryContext();

  const id = context?.id;

  const { backgroundColor } = useTheme();

  if (context && context.unboundStoryFn) {
    const { unboundStoryFn: StoryComponent } = context;

    return (
      <Box
        flex
        key={id}
        testID={id}
        onStartShouldSetResponder={dismissOnStartResponder}
        backgroundColor={backgroundColor}
      >
        {StoryComponent && <StoryComponent {...context} />}
      </Box>
    );
  }

  return (
    <Box flex padding={16} alignItems="center" justifyContent="center">
      <Text>Please open the sidebar and select a story to preview.</Text>
    </Box>
  );
};

export default React.memo(StoryView);
