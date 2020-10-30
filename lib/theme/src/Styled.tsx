import React, { ComponentType, ReactNode } from 'react';
import {
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
} from 'react-native';
import { Theme, theme } from './theme';
import { withTheme } from './ThemeContext';
// import { useTheme } from './useTheme';

export type ThemedStyle<T, StyleType> = (props: { theme: Theme } & T) => StyleType;

type RChildren = { children?: ReactNode | ReactNode[] };
type StyledProps<ComponentProps, StyleType, T> = ComponentProps &
  RChildren &
  T & { style?: StyleType };

export function createStyled<StyleType, ComponentProps>(Component: ComponentType<any>) {
  return function styledComponent<T>(stylefn: ThemedStyle<T, StyleType>) {
    const component = (props: StyledProps<ComponentProps, StyleType, T> & { theme: Theme }) => {
      // TODO: replace withTheme with use theme here once hooks are working
      // const theme = useTheme();
      const { style } = props;
      const themedStyle = stylefn({ ...props });
      return <Component {...props} style={[themedStyle, style]} />;
    };
    return withTheme<StyledProps<ComponentProps, StyleType, T>>(component);
  };
}

// type listTypes<Item> = FlatListProps<Item> | SectionListProps<Item>

function sectionList<Item, T = {}>(stylefn: ThemedStyle<T, ViewStyle>) {
  const component = (
    props: StyledProps<SectionListProps<Item>, ViewStyle, T> & { theme: Theme }
  ) => {
    // TODO: replace withTheme with use theme here once hooks are working
    // const theme = useTheme();
    const { style } = props;
    const themedStyle = stylefn({ ...props });
    return <SectionList style={[themedStyle, style]} {...props} />;
  };
  return withTheme<StyledProps<SectionListProps<Item>, ViewStyle, T>>(component);
}

export const styled = {
  View: createStyled<ViewStyle, ViewProps>(View),
  Text: createStyled<TextStyle, TextProps>(Text),
  TextInput: createStyled<TextStyle, TextInputProps>(TextInput),
  TouchableOpacity: createStyled<ViewStyle, TouchableOpacityProps>(TouchableOpacity),
  SectionList: sectionList,
};
