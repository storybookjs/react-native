import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-simple-markdown';
import { AddonStore } from '@storybook/addons';
import { API } from '@storybook/api';

export const PARAM_KEY = `notes`;

interface NotesProps {
  channel: ReturnType<AddonStore['getChannel']>;
  api: API;
  active: boolean;
}

export const Notes = ({ active, api }: NotesProps) => {
  if (!active) {
    return null;
  }

  const selection = api.store().getSelection();

  if (!selection) {
    return null;
  }

  const story = api.store().fromId(selection.storyId);
  const text = story.parameters[PARAM_KEY];

  const textAfterFormatted: string = text ? text.trim() : '';

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Markdown>{textAfterFormatted}</Markdown>
    </View>
  );
};
