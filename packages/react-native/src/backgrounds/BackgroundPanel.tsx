import type { AddonStore, API } from 'storybook/manager-api';
import { View } from 'react-native';
import { useCallback } from 'react';
import { UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { styled } from '@storybook/react-native-theming';

import Swatch from './Swatch';
import { PARAM_KEY } from './constants';

const codeSample = `
// In your preview config (.storybook/preview.tsx):
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#333333' },
        light: { name: 'Light', value: '#F7F9F2' },
        maroon: { name: 'Maroon', value: '#400000' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
};

export default preview;
`.trim();

const ThemedText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
}));

const TitleText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: 16,
  marginBottom: 8,
}));

const ParagraphText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  marginBottom: 8,
}));

const LockedText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  marginBottom: 10,
  fontStyle: 'italic',
  opacity: 0.7,
}));

const Instructions = () => (
  <View>
    <TitleText>Setup Instructions</TitleText>
    <ParagraphText>
      Add background options to your preview parameters. Each option should include a name and the
      corresponding color value.
    </ParagraphText>
    <ParagraphText>
      Below is an example of how to configure backgrounds in your preview config. Long press the
      example to copy it.
    </ParagraphText>
    <ThemedText selectable>{codeSample}</ThemedText>
  </View>
);

export type Channel = ReturnType<AddonStore['getChannel']>;
interface BackgroundPanelProps {
  channel: Channel;
  api: API;
  active: boolean;
}

interface BackgroundOptions {
  [key: string]: {
    name: string;
    value: string;
  };
}

const BackgroundPanel = ({ active, api, channel }: BackgroundPanelProps) => {
  const store = api.store();
  const storyId = store.getSelection()?.storyId;
  const story = storyId ? store.fromId(storyId) : null;

  // storyGlobals comes from PreparedStory spread in getStoryContext
  const isLocked = !!story?.storyGlobals?.[PARAM_KEY];

  const setBackground = useCallback(
    (name: string) => {
      channel.emit(UPDATE_GLOBALS, { globals: { [PARAM_KEY]: { value: name } } });
    },
    [channel]
  );

  const bgParams = story?.parameters?.[PARAM_KEY];
  const options: BackgroundOptions | undefined = bgParams?.options;
  if (options && Object.keys(options).length > 0) {
    return (
      <View style={{ padding: 10 }}>
        {isLocked && <LockedText>Background is set at the story level</LockedText>}
        {Object.entries(options).map(([key, { name, value }]) => (
          <View key={`${key} ${value}`}>
            <Swatch
              value={value}
              name={name || key}
              setBackground={() => setBackground(key)}
              disabled={isLocked}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <Instructions />
    </View>
  );
};

export default BackgroundPanel;
