import { Text } from 'react-native';

export interface Props {
  arrow: string | string[];
}

export const SelectExample = ({ arrow }: Props) => (
  <Text>Selected: {Array.isArray(arrow) ? arrow.join(', ') : arrow}</Text>
);
