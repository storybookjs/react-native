import { Theme } from '@storybook/react-native-theming';
import { Platform, TextStyle } from 'react-native';

export function inputStyle(theme: Theme, isTextInput = true): TextStyle {
  return {
    backgroundColor: theme.inputs.text.backgroundColor,
    borderWidth: theme.inputs.text.borderWidth,
    borderColor: theme.inputs.text.borderColor,
    borderRadius: theme.inputs.text.borderRadius,
    fontSize: theme.inputs.text.fontSize,
    color: theme.inputs.text.textColor,
    paddingHorizontal: theme.inputs.text.paddingHorizontal,
    ...Platform.select({
      android: {
        // Android seems to have builtin vertical padding to `TextInput`,
        // but not for multiline inputs.
        paddingVertical: isTextInput ? 0 : undefined,
      },
      web: {
        // The web (that isn't RNW) doesn't understand `paddingHorizontal` etc.
        paddingLeft: theme.inputs.text.paddingHorizontal,
        paddingRight: theme.inputs.text.paddingHorizontal,
        paddingTop: theme.inputs.text.paddingVertical,
        paddingBottom: theme.inputs.text.paddingVertical,
        borderStyle: 'solid',
      },
      default: {
        paddingVertical: theme.inputs.text.paddingVertical,
      },
    }),
    margin: 0,
  };
}
