import { Text } from 'react-native';

export interface Props {
  arrow: string;
}

export const SelectExample = ({ arrow }: Props) => <Text>Selected: {arrow}</Text>;
