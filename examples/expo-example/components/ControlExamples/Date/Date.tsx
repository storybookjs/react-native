import React from 'react';
import { Text } from 'react-native';

interface DateProps {
  date: Date;
}

export const DateString = ({ date }: DateProps) => <Text>{date.toString()}</Text>;
