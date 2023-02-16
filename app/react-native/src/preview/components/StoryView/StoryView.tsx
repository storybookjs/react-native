import React from 'react';

import { Text, View, StyleSheet } from 'react-native';
import { useStoryContext } from '../../../hooks';

const styles = StyleSheet.create({
  container: { flex: 1 },
  helpContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const StoryView = () => {
  const context = useStoryContext();
  const id = context?.id;

  if (context && context.unboundStoryFn) {
    const { unboundStoryFn: StoryComponent } = context;

    return (
      <View key={id} testID={id} style={styles.container}>
        {StoryComponent && <StoryComponent {...context} />}
      </View>
    );
  }

  return (
    <View style={styles.helpContainer}>
      <Text>Please open navigator and select a story to preview.</Text>
    </View>
  );
};

export default React.memo(StoryView);
