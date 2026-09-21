import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import { useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import {
  EnrichedMarkdownText,
  type MarkdownStyle,
  type Md4cFlags,
} from 'react-native-enriched-markdown';

import { RNAddonApi, StoryFromId } from '../register';
import { ErrorBoundary } from '../ErrorBoundary';
import { addons } from 'storybook/manager-api';
import { useTheme } from '@storybook/react-native-theming';

export const PARAM_KEY = 'notes';

interface NotesProps {
  active?: boolean;
  api: RNAddonApi;
}

type SyntaxColors = NonNullable<MarkdownStyle['codeBlock']>['syntaxColors'];

// Syntax highlight palettes (GitHub Primer "prettylights"), only visible when the host app compiles
// react-native-enriched-markdown with code highlighting enabled.
const lightSyntaxColors: SyntaxColors = {
  keyword: '#CF222E',
  string: '#0A3069',
  number: '#0550AE',
  constant: '#0550AE',
  comment: '#6E7781',
  function: '#8250DF',
  type: '#953800',
  property: '#0550AE',
  tag: '#116329',
  attribute: '#0550AE',
};

const darkSyntaxColors: SyntaxColors = {
  keyword: '#FF7B72',
  string: '#A5D6FF',
  number: '#79C0FF',
  constant: '#79C0FF',
  comment: '#8B949E',
  function: '#D2A8FF',
  type: '#FFA657',
  property: '#79C0FF',
  tag: '#7EE787',
  attribute: '#79C0FF',
};

// Extra syntax on top of GitHub Flavored Markdown: ==highlight==, ^superscript^ and ~subscript~.
// LaTeX math stays off so dollar amounts in notes are not parsed as formulas.
const md4cFlags: Md4cFlags = {
  highlight: true,
  superscript: true,
  subscript: true,
  latexMath: false,
};

const openLink = ({ url }: { url: string }) => {
  Linking.openURL(url).catch((error) => console.warn(error));
};

export const Notes = ({ active, api }: NotesProps) => {
  const theme = useTheme();
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

  const themedMarkdownStyle = useMemo<MarkdownStyle>(() => {
    const textColor = theme.color.defaultText;
    const boxBackground = theme.background.app;
    const borderColor = theme.color.border;
    const { size } = theme.typography;
    // Body text is 14pt; keep the line height proportional so the renderer's vertical centering
    // stays small and superscript/subscript offsets remain visible.
    // TODO: the theme has no line height token yet (other UI packages hardcode theirs as well).
    // Discuss adding `typography.lineHeight` to @storybook/react-native-theming and read it here.
    const bodyLineHeight = 20;

    return {
      paragraph: { fontSize: size.s2, lineHeight: bodyLineHeight, color: textColor },
      h1: { fontSize: size.l1, color: textColor },
      h2: { fontSize: size.m2, color: textColor },
      h3: { fontSize: size.m1, color: textColor },
      h4: { fontSize: size.s3, color: textColor },
      h5: { fontSize: size.s2, color: textColor },
      h6: { fontSize: size.s1, color: textColor },
      list: {
        fontSize: size.s2,
        lineHeight: bodyLineHeight,
        color: textColor,
        bulletColor: textColor,
        markerColor: textColor,
      },
      link: { color: theme.color.secondary, underline: true },
      strikethrough: { color: textColor },
      underline: { color: textColor },
      code: {
        color: textColor,
        backgroundColor: boxBackground,
        borderColor,
      },
      codeBlock: {
        fontSize: size.s2,
        color: textColor,
        backgroundColor: boxBackground,
        borderColor,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        syntaxColors: theme.base === 'dark' ? darkSyntaxColors : lightSyntaxColors,
      },
      blockquote: {
        fontSize: size.s2,
        lineHeight: bodyLineHeight,
        color: textColor,
        backgroundColor: boxBackground,
        borderColor: textColor,
        borderWidth: 4,
      },
      thematicBreak: { color: textColor, height: 1 },
      image: { maxHeight: 240, resizeMode: 'contain' },
      taskList: {
        checkedTextColor: textColor,
        checkedColor: theme.color.secondary,
        checkmarkColor: theme.color.lightest,
      },
      highlight: {
        backgroundColor: theme.base === 'dark' ? theme.color.warning : theme.background.warning,
        color: theme.color.darkest,
      },
      table: {
        fontSize: size.s2,
        lineHeight: bodyLineHeight,
        color: textColor,
        borderColor: textColor,
        borderWidth: 1,
        borderRadius: 3,
        cellPaddingHorizontal: 5,
        cellPaddingVertical: 5,
        headerTextColor: textColor,
        headerBackgroundColor: boxBackground,
        rowEvenBackgroundColor: 'transparent',
        rowOddBackgroundColor: 'transparent',
      },
    };
  }, [theme]);

  if (!story) {
    return null;
  }

  const notes = story?.parameters?.[PARAM_KEY];

  const text = typeof notes === 'string' ? notes.trim() : '';

  if (!text) return null;

  return (
    <View style={styles.container}>
      <ErrorBoundary>
        <EnrichedMarkdownText
          flavor="github"
          md4cFlags={md4cFlags}
          markdown={text}
          markdownStyle={themedMarkdownStyle}
          onLinkPress={openLink}
        />
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
