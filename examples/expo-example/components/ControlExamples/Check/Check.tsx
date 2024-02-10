import React from 'react';
import { Text } from 'react-native';

interface Props {
  rotationAxis: Array<'x' | 'y' | 'z'>;
}

export const CheckExample = ({ rotationAxis }: Props) => {
  return <Text>axis: {rotationAxis.join(', ')}</Text>;
};
