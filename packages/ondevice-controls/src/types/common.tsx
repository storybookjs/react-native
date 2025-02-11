import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { styled, Theme } from '@storybook/react-native-theming';
import { useLayout } from '@storybook/react-native-ui';
import { forwardRef } from 'react';
import { Platform, TextInput, TextInputProps, TextStyle } from 'react-native';

export function inputStyle({
  theme,
  focused = false,
  hasError = false,
}: {
  theme: Theme;
  focused?: boolean;
  hasError?: boolean;
}): TextStyle {
  return {
    backgroundColor: theme.input.background,
    // TODO: border?
    borderWidth: 1,
    borderRadius: theme.input.borderRadius,
    borderColor: hasError
      ? theme.color.negative
      : focused
      ? theme.color.secondary
      : theme.input.border,
    fontSize: theme.typography.size.s2 - 1,
    color: theme.input.color,
    paddingHorizontal: theme.input.paddingHorizontal,

    ...Platform.select({
      android: {
        paddingVertical: theme.input.paddingVertical,
      },
      web: {
        // The web (that isn't RNW) doesn't understand `paddingHorizontal` etc.
        paddingLeft: theme.input.paddingHorizontal,
        paddingRight: theme.input.paddingHorizontal,
        paddingTop: theme.input.paddingVertical,
        paddingBottom: theme.input.paddingVertical,
        borderStyle: 'solid',
      },
      default: {
        paddingVertical: theme.input.paddingVertical,
      },
    }),
    margin: 0,
  };
}

const TextInputWithSwitcher = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { isMobile } = useLayout();

  return isMobile ? (
    // @ts-ignore
    <BottomSheetTextInput ref={ref} {...props} />
  ) : (
    <TextInput ref={ref} {...props} />
  );
});

export const Input = styled(TextInputWithSwitcher)<{
  focused?: boolean;
  hasError?: boolean;
}>(({ theme, focused, hasError }) => ({
  ...inputStyle({ theme, focused, hasError }),
}));
