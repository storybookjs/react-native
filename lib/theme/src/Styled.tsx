import React, { ComponentType, ReactChildren, ReactNode } from 'react';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Text,
  TextInput,
  ViewProps,
  TextProps,
  TextInputProps,
  TouchableOpacityProps,
  TouchableOpacity,
  SectionListProps,
  SectionList,
  FlatListProps,
} from 'react-native';
import { Theme, theme } from './theme';
import { useTheme } from './useTheme';

export type ThemedStyle<T, StyleType> = (props: { theme: Theme } & T) => StyleType;

type RChildren = { children?: ReactNode | ReactNode[] };
type StyledProps<ComponentProps, StyleType, T> = ComponentProps &
  RChildren &
  T & { style?: StyleType };

// function view<T>(stylefn: ThemedStyle<T, ViewStyle>) {
//   return (props: StyledProps<ViewProps, ViewStyle, T>) => {
//     const theme = useTheme();
//     const { style } = props;
//     const themedStyle = stylefn({ theme, ...props });
//     return <View style={[themedStyle, style]} {...props} />;
//   };
// }

// function text<T>(stylefn: ThemedStyle<T, TextStyle>) {
//   return (props: StyledProps<TextProps, TextStyle, T>) => {
//     const theme = useTheme();

//     const { style } = props;
//     const themedStyle = stylefn({ theme, ...props });
//     return <Text style={[themedStyle, style]} {...props} />;
//   };
// }

// function textInput<T>(stylefn: ThemedStyle<T, TextStyle>) {
//   return (props: StyledProps<TextInputProps, TextStyle, T>) => {
//     const theme = useTheme();
//     const { style } = props;
//     const themedStyle = stylefn({ theme, ...props });
//     return <TextInput style={[themedStyle, style]} {...props} />;
//   };
// }

export function createStyled<StyleType, ComponentProps>(Component: ComponentType<any>) {
  return function styledComponent<T>(stylefn: ThemedStyle<T, StyleType>) {
    return (props: StyledProps<ComponentProps, StyleType, T>) => {
      // const theme = useTheme();
      const { style } = props;
      const themedStyle = stylefn({ theme, ...props });
      return <Component style={[themedStyle, style]} {...props} />;
    };
  };
}

// type listTypes<Item> = FlatListProps<Item> | SectionListProps<Item>

function sectionList<Item, T = {}>(stylefn: ThemedStyle<T, ViewStyle>) {
  return (props: StyledProps<SectionListProps<Item>, ViewStyle, T>) => {
    // const theme = useTheme();
    const { style } = props;
    const themedStyle = stylefn({ theme, ...props });
    return <SectionList style={[themedStyle, style]} {...props} />;
  };
}

export const styled = {
  View: createStyled<ViewStyle, ViewProps>(View),
  Text: createStyled<TextStyle, TextProps>(Text),
  TextInput: createStyled<TextStyle, TextInputProps>(TextInput),
  TouchableOpacity: createStyled<ViewStyle, TouchableOpacityProps>(TouchableOpacity),
  SectionList: sectionList,
};
