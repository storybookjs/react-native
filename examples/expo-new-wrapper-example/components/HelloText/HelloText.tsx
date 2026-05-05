import { Text } from 'react-native';

export interface HelloTextProps {
  message: string;
}

export function HelloText({ message }: HelloTextProps) {
  return <Text style={{ fontSize: 18 }}>{message}</Text>;
}
