import React from 'react';
import { Text } from 'react-native';

interface DateProps {
  date: Date;
}

export const LocalisedDate = ({ date }: DateProps) => (
  <Text>
    {date.toLocaleDateString()} {date.toLocaleTimeString()}
  </Text>
);
