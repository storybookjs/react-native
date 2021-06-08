/**
 * mostly based on code from https://github.com/CharlesMangwa/react-native-simple-markdown
 */
import React, { Component, ReactElement } from 'react';
import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import SimpleMarkdown, { ParserRules } from 'simple-markdown';

// @ts-ignore
import initialRules from './rules';
import initialStyles from './styles';

export type Props = {
  children: string;
  errorHandler?: (errors: any[], children: string) => void;
  rules: ParserRules;
  styles: { view?: ViewStyle; text?: TextStyle; image?: ImageStyle };
};

export type DefaultProps = Props & {
  styles: Object;
};

class Markdown extends Component<Props> {
  static defaultProps: DefaultProps = {
    children: '',
    rules: {},
    styles: initialStyles,
  };

  shouldComponentUpdate = (nextProps: Props): boolean =>
    this.props.children !== nextProps.children || this.props.styles !== nextProps.styles;

  // @TODO: Rewrite this part to prevent text from overriding other rules
  /** Post processes rules to strip out unwanted styling options
   *  while keeping the default 'paragraph' and 'text' rules
   */

  _renderContent = (children: string): ReactElement => {
    try {
      const mergedStyles = { ...initialStyles, ...this.props.styles };

      const rules = initialRules(mergedStyles);

      // @TODO: Add another \n?
      const blockSource = `${children}\n\n`;
      const tree = SimpleMarkdown.parserFor(rules)(blockSource, {
        inline: false,
      });
      return SimpleMarkdown.outputFor(rules, 'react')(tree);
    } catch (errors) {
      this.props.errorHandler ? this.props.errorHandler(errors, children) : console.error(errors);
    }
    return null;
  };

  render() {
    return <View style={[this.props.styles.view]}>{this._renderContent(this.props.children)}</View>;
  }
}

export default Markdown;
