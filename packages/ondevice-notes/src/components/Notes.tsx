import { SET_CURRENT_STORY } from '@storybook/core/core-events';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { RNAddonApi, StoryFromId } from '../register';
import { ErrorBoundary } from '../ErrorBoundary';
import { addons } from '@storybook/core/manager-api';
import { useTheme } from '@storybook/react-native-theming';

export const PARAM_KEY = 'notes';

interface NotesProps {
  active: boolean;
  api: RNAddonApi;
}

export const Notes = ({ active, api }: NotesProps) => {
  const theme = useTheme();
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

  const themedMarkdownStyles = useMemo(
    () => ({
      body: {
        color: theme.color.defaultText,
      },
      hr: {
        backgroundColor: theme.color.defaultText,
      },
      blockquote: {
        borderColor: theme.color.defaultText,
      },
      table: {
        borderColor: theme.color.defaultText,
      },
      tr: {
        borderColor: theme.color.defaultText,
      },
      blocklink: {
        borderColor: theme.color.defaultText,
      }
    }),
    [theme.color.defaultText]);
  return (
    <View style={styles.container}>
      {textAfterFormatted && (
        <ErrorBoundary>
          {/* @ts-ignore has the wrong types */}
          <Markdown style={themedMarkdownStyles}>
            {textAfterFormatted}
          </Markdown>
        </ErrorBoundary>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

