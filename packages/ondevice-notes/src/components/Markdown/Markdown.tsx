/**
 * mostly based on code from https://github.com/CharlesMangwa/react-native-simple-markdown
 */

import React, { ReactElement } from 'react';
import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import SimpleMarkdown from 'simple-markdown';

// @ts-ignore
import initialRules from './rules';
import { useThemedStyles } from './styles';

export type Props = {
  children?: string;
  errorHandler?: (errors: any[], children: string) => void;
  styles?: { view?: ViewStyle; text?: TextStyle; image?: ImageStyle };
};

export type DefaultProps = Props & {
  styles: Object;
};

const Markdown = ({ children = '', errorHandler }: Props) => {
  const styles = useThemedStyles();

  const _renderContent = (): ReactElement => {
    try {
      const rules = initialRules(styles);

      // @TODO: Add another \n?
      const blockSource = `${children}\n\n`;

      const tree = SimpleMarkdown.parserFor(rules)(blockSource, {
        inline: false,
      });

      return SimpleMarkdown.outputFor(rules, 'react')(tree);
    } catch (errors) {
      errorHandler ? errorHandler(errors, children) : console.error(errors);
    }

    return null;
  };

  return <View>{_renderContent()}</View>;
};

export default React.memo(Markdown);
