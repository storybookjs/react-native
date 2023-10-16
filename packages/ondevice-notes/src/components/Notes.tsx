import { SET_CURRENT_STORY } from '@storybook/core-events';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { RNAddonApi, StoryFromId } from '../register';
import { ErrorBoundary } from '../ErrorBoundary';

export const PARAM_KEY = 'notes';

interface NotesProps {
  api: RNAddonApi;
  active: boolean;
}

export const Notes = ({ active, api }: NotesProps) => {
  const [story, setStory] = useState<StoryFromId | null>();

  useEffect(() => {
    const store = api?.store?.();

    if (active) {
      const selection = store?.getSelection?.();

      const storyFromId = selection?.storyId ? store?.fromId?.(selection?.storyId) : null;
      if (storyFromId) {
        setStory(storyFromId);
      } else {
        setStory(null);
      }
    }
  }, [api, active]);

  useEffect(() => {
    let mounted = true;

    const store = api?.store?.();
    store?._channel?.on(SET_CURRENT_STORY, ({ storyId }) => {
      // const selection = store.getSelection();
      // SET_CURRENT_STORY
      if (mounted) {
        const storyFromId = store?.fromId?.(storyId);
        if (storyFromId) {
          setStory(storyFromId);
        } else {
          setStory(null);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [api]);

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
