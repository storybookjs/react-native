/**
 * mostly based on code from https://github.com/CharlesMangwa/react-native-simple-markdown
 */
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native/types';

interface Styles {
  [key: string]: StyleProp<ViewStyle | TextStyle | ImageStyle>;
}

export const useThemedStyles = (): Styles => {
  const theme = useTheme();

  const styles: Styles = useMemo(
    () => ({
      blockQuoteSection: {
        flexDirection: 'row',
      },
      blockQuoteSectionBar: {
        width: 3,
        backgroundColor: '#DDDDDD',
        marginRight: 15,
      },
      codeBlock: {
        fontWeight: '500',
      },
      del: {
        textDecorationLine: 'line-through',
      },
      em: {
        fontStyle: 'italic',
      },
      heading: {
        fontWeight: '200',
      },
      heading1: {
        fontSize: 32,
      },
      heading2: {
        fontSize: 24,
      },
      heading3: {
        fontSize: 18,
      },
      heading4: {
        fontSize: 16,
      },
      heading5: {
        fontSize: 13,
      },
      heading6: {
        fontSize: 11,
      },
      hr: {
        backgroundColor: '#cccccc',
      },
      image: {
        width: 320,
        height: 320,
      },
      inlineCode: {
        backgroundColor: '#eeeeee',
        borderColor: '#dddddd',
        borderRadius: 3,
        borderWidth: 1,
        fontWeight: 'bold',
      },
      link: {
        textDecorationLine: 'underline',
      },
      list: { width: '100%' },
      listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      },
      listItemNumber: {
        fontWeight: 'bold',
        color: theme.text.primaryColor,
      },
      listItemBullet: {
        fontWeight: 'bold',
        color: theme.text.primaryColor,
      },
      mailTo: {
        textDecorationLine: 'underline',
      },
      paragraph: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      listItemText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color: theme.text.primaryColor,
      },
      strong: {
        fontWeight: 'bold',
      },
      table: {
        borderWidth: 1,
        borderColor: theme.text.primaryColor,
        borderRadius: 3,
      },
      tableHeader: {
        backgroundColor: theme.text.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      tableHeaderCell: {
        color: theme.backgroundColor,
        fontWeight: 'bold',
        padding: 5,
      },
      tableRow: {
        borderBottomWidth: 1,
        borderColor: theme.text.primaryColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      tableRowLast: {
        borderColor: 'transparent',
      },
      tableRowCell: {
        padding: 5,
      },
      text: {
        color: theme.text.primaryColor,
      },
      u: {
        textDecorationLine: 'underline',
      },
      video: {
        width: 300,
        height: 300,
      },
    }),
    [theme.backgroundColor, theme.text.primaryColor]
  );

  return styles;
};
