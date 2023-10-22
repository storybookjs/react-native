import { SET_CURRENT_STORY } from '@storybook/core-events';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { RNAddonApi, StoryFromId } from '../register';
import { ErrorBoundary } from '../ErrorBoundary';
import { addons } from '@storybook/manager-api';

export const PARAM_KEY = 'notes';

interface NotesProps {
  active: boolean;
  api: RNAddonApi;
}

export const Notes = ({ active, api }: NotesProps) => {
  const [story, setStory] = useState<StoryFromId | null>();

  useEffect(() => {
    const selection = api.store().getSelection();

    const handleSetCurrentStory = ({ storyId }) => {
      setStory(api.store().fromId(storyId));
    };

    // set initial story
    handleSetCurrentStory({ storyId: selection.storyId });

    const channel = addons.getChannel();

    channel.on(SET_CURRENT_STORY, handleSetCurrentStory);

    return () => channel.off(SET_CURRENT_STORY, handleSetCurrentStory);
  }, [api, active]);

  if (!active || !story) {
    return null;
  }

  const text: string =
    story?.parameters && story.parameters[PARAM_KEY] ? story.parameters[PARAM_KEY] : '';

  if (!text) return null;

  const textAfterFormatted: string = text ? text.trim() : '';

  return (
    <View style={styles.container}>
      {textAfterFormatted && (
        <ErrorBoundary>
          {/* @ts-ignore has the wrong types */}
          <Markdown>{textAfterFormatted}</Markdown>
        </ErrorBoundary>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
