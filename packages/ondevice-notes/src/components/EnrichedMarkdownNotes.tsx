import { useMemo } from 'react';
import { Linking } from 'react-native';
import type { MarkdownStyle, Md4cFlags } from 'react-native-enriched-markdown';
import { useTheme } from '@storybook/react-native-theming';

import type { EnrichedMarkdownModule } from '../enrichedMarkdown';

interface EnrichedMarkdownNotesProps {
  markdown: string;
  EnrichedMarkdownText: EnrichedMarkdownModule['EnrichedMarkdownText'];
}

type SyntaxColors = NonNullable<MarkdownStyle['codeBlock']>['syntaxColors'];

// GitHub "prettylights" palettes, only visible when the app compiles highlighting in.
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

// LaTeX off so dollar amounts in notes are not parsed as formulas.
const md4cFlags: Md4cFlags = {
  highlight: true,
  superscript: true,
  subscript: true,
  latexMath: false,
};

const openLink = ({ url }: { url: string }) => {
  Linking.openURL(url).catch((error) => console.warn(error));
};

export const EnrichedMarkdownNotes = ({
  markdown,
  EnrichedMarkdownText,
}: EnrichedMarkdownNotesProps) => {
  const theme = useTheme();

  const themedMarkdownStyle = useMemo<MarkdownStyle>(() => {
    const textColor = theme.color.defaultText;
    const boxBackground = theme.background.app;
    const borderColor = theme.color.border;
    const { size } = theme.typography;
    // Proportional to the 14pt body so superscript/subscript offsets stay visible.
    // TODO: add a line height token to @storybook/react-native-theming and use it here.
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

  return (
    <EnrichedMarkdownText
      flavor="github"
      md4cFlags={md4cFlags}
      markdown={markdown}
      markdownStyle={themedMarkdownStyle}
      onLinkPress={openLink}
    />
  );
};
