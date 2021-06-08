/**
 * mostly based on code from https://github.com/CharlesMangwa/react-native-simple-markdown
 */
import { createElement } from 'react';
import {
  Image,
  Text,
  View,
  Linking,
  TextStyle,
  ViewStyle,
  ImageStyle,
  StyleProp,
} from 'react-native';
import SimpleMarkdown, { Output, ReactElements, State, SingleASTNode } from 'simple-markdown';

interface Styles {
  [key: string]: StyleProp<ViewStyle | TextStyle | ImageStyle>;
}

export default (styles: Styles) => ({
  ...SimpleMarkdown.defaultRules,
  autolink: {
    ...SimpleMarkdown.defaultRules.autolink,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.link,
          onPress: () => null,
        },
        output(node.content, state)
      );
    },
  },
  blockQuote: {
    ...SimpleMarkdown.defaultRules.blockQuote,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      const blockBar = createElement(View, {
        key: state.key,
        style: [styles.blockQuoteSectionBar, styles.blockQuoteBar],
      });
      const blockText = createElement(
        Text,
        {
          key: state.key,
          style: styles.blockQuoteText,
        },
        output(node.content, state)
      );
      return createElement(
        View,
        {
          key: state.key,
          style: [styles.blockQuoteSection, styles.blockQuote],
        },
        [blockBar, blockText]
      );
    },
  },
  br: {
    ...SimpleMarkdown.defaultRules.br,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.br,
        },
        '\n\n'
      );
    },
  },
  codeBlock: {
    ...SimpleMarkdown.defaultRules.codeBlock,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.codeBlock,
        },
        null
      );
    },
  },
  del: {
    ...SimpleMarkdown.defaultRules.del,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.del,
        },
        output(node.content, state)
      );
    },
  },
  em: {
    ...SimpleMarkdown.defaultRules.em,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.em,
        },
        output(node.content, state)
      );
    },
  },
  heading: {
    ...SimpleMarkdown.defaultRules.heading,
    react: (node: SingleASTNode, output: Output<ReactElements>, parentState: State) => {
      const state = { ...parentState };
      state.withinText = true;
      const stylesToApply = [styles.heading, styles[`heading${node.level}`]];
      state.stylesToApply = stylesToApply;
      return createElement(
        Text,
        {
          key: state.key,
          style: stylesToApply,
        },
        output(node.content, state)
      );
    },
  },
  hr: {
    ...SimpleMarkdown.defaultRules.hr,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) =>
      createElement(View, { key: state.key, style: styles.hr }),
  },
  image: {
    ...SimpleMarkdown.defaultRules.image,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) =>
      createElement(Image, {
        key: state.key,
        resizeMode: 'contain',
        source: { uri: node.target },
        style: (node.target.match(/youtu|vimeo/) ? styles.video : styles.image) as ImageStyle,
        //styles.resizeMode ? styles.resizeMode :
      }),
  },
  inlineCode: {
    ...SimpleMarkdown.defaultRules.inlineCode,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.inlineCode,
        },
        node.content
      );
    },
  },
  link: {
    ...SimpleMarkdown.defaultRules.link,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      const openUrl = (url: string) => {
        Linking.openURL(url).catch((error) => console.warn('An error occurred: ', error));
      };
      return createElement(
        Text,
        {
          style: node.target.match(/@/) ? styles.mailTo : styles.link,
          key: state.key,
          onPress: () => openUrl(node.target),
        },
        output(node.content, state)
      );
    },
  },
  list: {
    ...SimpleMarkdown.defaultRules.list,
    react: (
      node: { items: Array<SingleASTNode>; ordered: boolean },
      output: Output<ReactElements>,
      state: State
    ) => {
      const items = node.items.map((item: SingleASTNode, i: number) => {
        let bullet;
        if (node.ordered) {
          bullet = createElement(
            Text,
            { key: state.key, style: styles.listItemNumber },
            `${i + 1} . `
          );
        } else {
          bullet = createElement(Text, { key: state.key, style: styles.listItemBullet }, '\u2022 ');
        }

        const listItemText = createElement(
          Text,
          { key: (state.key as number) + 1, style: styles.listItemText },
          output(item, state)
        );
        return createElement(
          View,
          {
            key: i,
            style: styles.listItem,
          },
          [bullet, listItemText]
        );
      });
      return createElement(View, { key: state.key, style: styles.list }, items);
    },
  },
  newline: {
    ...SimpleMarkdown.defaultRules.newline,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) =>
      createElement(
        Text,
        {
          key: state.key,
          style: styles.newline,
        },
        '\n'
      ),
  },
  paragraph: {
    ...SimpleMarkdown.defaultRules.paragraph,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) =>
      createElement(
        View,
        {
          key: state.key,
          style: styles.paragraph,
        },
        output(node.content, state)
      ),
  },
  strong: {
    ...SimpleMarkdown.defaultRules.strong,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.strong,
        },
        output(node.content, state)
      );
    },
  },
  table: {
    ...SimpleMarkdown.defaultRules.table,
    react: (
      node: { header: Array<SingleASTNode>; cells: Array<Array<SingleASTNode>> },
      output: Output<ReactElements>,
      state: State
    ) => {
      const headers = node.header.map((content, i) =>
        createElement(
          Text,
          {
            style: styles.tableHeaderCell,
            key: i,
          },
          output(content, state)
        )
      );

      const header = createElement(View, { style: styles.tableHeader }, headers);

      const rows = node.cells.map((row: Array<SingleASTNode>, r) => {
        const cells = row.map((content, c) =>
          createElement(
            View,
            {
              key: c,
              style: styles.tableRowCell,
            },
            output(content, state)
          )
        );
        const rowStyles = [styles.tableRow];
        node.cells.length - 1 === r ? rowStyles.push(styles.tableRowLast) : null;
        return createElement(View, { key: r, style: rowStyles }, cells);
      });

      return createElement(View, { key: state.key, style: styles.table }, [header, rows]);
    },
  },
  text: {
    ...SimpleMarkdown.defaultRules.text,
    react: (node: SingleASTNode, output: Output<ReactElements>, parentState: State) => {
      const state = { ...parentState };
      // Breaking words up in order to allow for text reflowing in flexbox
      // let words = node.content.split(' ');
      // words = words.map((word: string, i: number) => {
      //   i !== words.length - 1 ? (word = `${word} `) : null;
      const textStyles = [styles.text];
      //   !state.withinText ? textStyles.push(styles.plainText) : null;
      //   state.stylesToApply ? textStyles.push(state.stylesToApply) : null;
      return createElement(
        Text,
        {
          key: state.key,
          style: textStyles,
        },
        node.content
      );
    },
  },
  u: {
    ...SimpleMarkdown.defaultRules.u,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.u,
        },
        output(node.content, state)
      );
    },
  },
  url: {
    ...SimpleMarkdown.defaultRules.url,
    react: (node: SingleASTNode, output: Output<ReactElements>, state: State) => {
      state.withinText = true;
      const openURL = (url: string) => {
        Linking.openURL(url).catch((error) => console.warn('An error occurred: ', error));
      };
      return createElement(
        Text,
        {
          key: state.key,
          style: styles.url,
          onPress: () => openURL(node.target),
        },
        output(node.content, state)
      );
    },
  },
});
