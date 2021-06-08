/**
 * mostly based on code from https://github.com/CharlesMangwa/react-native-simple-markdown
 */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  blockQuoteSection: {
    flexDirection: 'row',
  },
  blockQuoteSectionBar: {
    width: 3,
    backgroundColor: '#DDDDDD',
    marginRight: 15,
  },
  codeBlock: {
    fontFamily: 'Courier',
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
    fontFamily: 'Courier',
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
  },
  listItemBullet: {
    fontWeight: 'bold',
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
    color: '#222222',
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: '#222222',
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
    color: '#222222',
  },
  u: {
    textDecorationLine: 'underline',
  },
  video: {
    width: 300,
    height: 300,
  },
});
