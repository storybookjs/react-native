import { ViewProps, ViewStyle } from 'react-native';
import styled from '@emotion/native';

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
export const Box = styled.View<BoxProps>(({ flex, ...layoutProps }) => ({
  flex: flex === true ? 1 : flex === false ? 0 : flex,
  ...layoutProps,
}));
