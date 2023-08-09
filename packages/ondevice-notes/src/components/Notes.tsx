import { API } from '@storybook/api';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { AddonStore, addons } from '@storybook/manager-api';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from './Markdown/Markdown';

export const PARAM_KEY = 'notes';

interface NotesProps {
  channel: ReturnType<AddonStore['getChannel']>;
  api: API;
  active: boolean;
}

export const Notes = ({ active, api }: NotesProps) => {
  const [story, setStory] = useState<any>();

  useEffect(() => {
    if (active) {
      const selection = api.store().getSelection();

      setStory(api.store().fromId(selection.storyId));
    }

    addons.getChannel().on(SET_CURRENT_STORY, () => {
      const selection = api.store().getSelection();

      setStory(api.store().fromId(selection.storyId));
    });
  }, [api, active]);

  if (!active || !story) {
    return null;
  }

  const text: string = story.parameters[PARAM_KEY];

  const textAfterFormatted: string = text ? text.trim() : '';

  return (
    <View style={styles.container}>
      <Markdown>{textAfterFormatted}</Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
