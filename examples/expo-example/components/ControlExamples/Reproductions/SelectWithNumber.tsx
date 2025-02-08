import { Text, TouchableOpacity, View } from 'react-native';

export type ButtonProps = {
  number: keyof {
    1: 'test';
    2: 'test';
    3: 'test';
    4: 'test';
    5: 'test';
    6: 'test';
    7: 'test';
    8: 'test';
    9: 'test';
  };
};

export const MyButton = ({ number }: ButtonProps) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8}>
        <Text>num: {number}</Text>
      </TouchableOpacity>
    </View>
  );
};
