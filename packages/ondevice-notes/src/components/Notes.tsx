import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RNAddonApi, StoryFromId } from '../register';
import { ErrorBoundary } from '../ErrorBoundary';
import { addons } from 'storybook/manager-api';
import { getEnrichedMarkdown } from '../enrichedMarkdown';
import { EnrichedMarkdownNotes } from './EnrichedMarkdownNotes';
import { MarkdownDisplayNotes } from './MarkdownDisplayNotes';

export const PARAM_KEY = 'notes';

interface NotesProps {
  active?: boolean;
  api: RNAddonApi;
}

export const Notes = ({ active, api }: NotesProps) => {
  const [story, setStory] = useState<StoryFromId | null>();

  useEffect(() => {
    const selection = api.store().getSelection();

    const handleSetCurrentStory = ({ storyId }: { storyId: string }) => {
      setStory(api.store().fromId(storyId));
    };

    // set initial story
    handleSetCurrentStory({ storyId: selection.storyId });

    const channel = addons.getChannel();

    channel.on(SET_CURRENT_STORY, handleSetCurrentStory);

    return () => channel.off(SET_CURRENT_STORY, handleSetCurrentStory);
  }, [api, active]);

  // Prefer the native renderer, fall back to the JS one where it is unavailable (cached lookup).
  const enriched = getEnrichedMarkdown();

  if (!story) {
    return null;
  }

  const notes = story.parameters?.[PARAM_KEY];

  const text = typeof notes === 'string' ? notes.trim() : '';

  if (!text) return null;

  return (
    <View style={styles.container}>
      <ErrorBoundary>
        {enriched ? (
          <EnrichedMarkdownNotes
            markdown={text}
            EnrichedMarkdownText={enriched.EnrichedMarkdownText}
          />
        ) : (
          <MarkdownDisplayNotes markdown={text} />
        )}
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
