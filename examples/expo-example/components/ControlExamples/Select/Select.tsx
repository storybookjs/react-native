import React from 'react';
import { Text } from 'react-native';

interface Props {
  arrow: string;
}

export const SelectExample = ({ arrow }: Props) => <Text>Selected: {arrow}</Text>;
