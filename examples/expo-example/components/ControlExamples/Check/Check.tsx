import { Text } from 'react-native';

export interface CheckProps {
  toppings?: string[];
}

export const Check = ({ toppings = [] }: CheckProps) => {
  return <Text>Toppings: {toppings.length > 0 ? toppings.join(', ') : 'none'}</Text>;
};
