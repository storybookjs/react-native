import React /*, { useState, useEffect } */ from 'react';

// import { StoreItem } from '@storybook/client-api';
import { Text, View, StyleSheet } from 'react-native';
import { StoryContext } from '@storybook/addons';

interface Props {
  context?: StoryContext;
}

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

const StoryView = ({ context }: Props) => {
  // const [context,story: setContext] = useState<StoryContext | undefined>(undefined);
  const id = context?.id;

  // useEffect(() => {
  //   const loadContext = async () => {
  //     if (story && story.unboundStoryFn && story.applyLoaders) {
  //       setContext(await story.applyLoaders());
  //     }
  //   };
  //   loadContext();
  // }, [story, id]);

  console.log({ context });
  if (context && context.unboundStoryFn) {
    const { unboundStoryFn: StoryComponent } = context;
    // const StoryComponent = context && context.id === story.id ? unboundStoryFn : null;
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

export default StoryView;
