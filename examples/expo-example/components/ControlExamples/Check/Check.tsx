import React, { useEffect } from 'react';
import { Text } from 'react-native';

interface Props {
  rotationAxis: Array<'x' | 'y' | 'z'>;
}

export const CheckExample = ({ rotationAxis }: Props) => {
  useEffect(() => {
    console.log(
      'rotationAxis',
      JSON.stringify(rotationAxis),
      typeof rotationAxis,
      Array.isArray(rotationAxis)
    );
  });

  return <Text>axis: {rotationAxis.join(', ')}</Text>;
};
