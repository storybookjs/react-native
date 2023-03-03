import React from 'react';

import { Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useStoryContext } from '../../../hooks';
import { Box } from '../Shared/layout';

const StoryView = () => {
  const context = useStoryContext();
  const id = context?.id;

  if (context && context.unboundStoryFn) {
    const { unboundStoryFn: StoryComponent } = context;

    // Wrapped in `TouchableWithoutFeedback` so that a tap in the story view,
    // outside of something that handles the press, will dismiss the keyboard.
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex key={id} testID={id}>
          {StoryComponent && <StoryComponent {...context} />}
        </Box>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <Box flex padding={16} alignItems="center" justifyContent="center">
      <Text>Please open navigator and select a story to preview.</Text>
    </Box>
  );
};

export default React.memo(StoryView);
