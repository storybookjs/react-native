import { View, ViewProps, ViewStyle } from 'react-native';
import { styled } from '@storybook/react-native-theming';

interface BoxProps extends ViewProps, Omit<ViewStyle, 'flex'> {
  /**
   * Flex value, can be `true` to mean the commonly used `flex={1}`.
   */
  flex?: boolean | number;
}

/**
 * A general (flex)box layout component that accepts props for flexbox layout
 * styles, such as `flex`, `alignItems`, `marginVertical`, etc.
 *
 * @example
 * ```tsx
 * <Box flex flexDirection='row' alignItems='center' marginVertical={42}>
 *   <MyContent />
 * </Box>
 * ```
 */
export const Box: typeof View = styled.View<BoxProps>(({ flex }) => ({
  flex: flex === true ? 1 : flex === false ? 0 : flex,
}));
