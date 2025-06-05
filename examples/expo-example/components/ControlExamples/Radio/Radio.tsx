import { Text } from 'react-native';

export interface RadioProps {
  selection: string;
}

export const Radio = ({ selection = '' }: RadioProps) => {
  return <Text>{selection}</Text>;
};
