import { useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@storybook/react-native-theming';

interface MarkdownDisplayNotesProps {
  markdown: string;
}

/**
 * JavaScript fallback renderer, used when react-native-enriched-markdown is not installed or its
 * native component is unavailable (Expo Go, tvOS, old architecture).
 */
export const MarkdownDisplayNotes = ({ markdown }: MarkdownDisplayNotesProps) => {
  const theme = useTheme();

  const themedMarkdownStyles = useMemo(
    () => ({
      body: {
        color: theme.color.defaultText,
      },
      hr: {
        backgroundColor: theme.color.defaultText,
      },
      table: {
        borderColor: theme.color.defaultText,
      },
      tr: {
        borderColor: theme.color.defaultText,
      },
      blocklink: {
        borderColor: theme.color.defaultText,
      },
      code_inline: {
        color: theme.color.defaultText,
        backgroundColor: theme.background.app,
      },
      code_block: {
        color: theme.color.defaultText,
        backgroundColor: theme.background.app,
      },
      fence: {
        color: theme.color.defaultText,
        backgroundColor: theme.background.app,
      },
      blockquote: {
        borderColor: theme.color.defaultText,
        backgroundColor: theme.background.app,
      },
    }),
    [theme.color.defaultText, theme.background.app]
  );

  return <Markdown style={themedMarkdownStyles}>{markdown}</Markdown>;
};
