import { Text } from 'react-native';

export interface DateProps {
  date: Date;
}

export const DateString = ({ date }: DateProps) => <Text>{date.toString()}</Text>;
