import React from 'react';
import { Text } from 'react-native';

interface RadioProps {
  selection: string;
}

export const Radio = ({ selection = '' }: RadioProps) => {
  return <Text>{selection}</Text>;
};
