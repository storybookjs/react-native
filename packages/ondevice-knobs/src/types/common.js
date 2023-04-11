import { Platform } from 'react-native';

export function inputStyle(theme, isTextInput = true) {
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
      default: {
        paddingVertical: theme.inputs.text.paddingVertical,
      },
    }),
    margin: 0,
  };
}
