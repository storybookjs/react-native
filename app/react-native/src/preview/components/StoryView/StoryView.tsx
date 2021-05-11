import React from 'react';

import { StoreItem } from '@storybook/client-api/dist/types';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  story: StoreItem;
}

const styles = StyleSheet.create({
  helpContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const StoryView = ({ story }: Props) => {
  if (story && story.storyFn) {
    const { id, storyFn } = story;
    return (
      <View key={id} testID={id} style={{ flex: 1 }}>
        {storyFn()}
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
