import { Pressable, Text, type GestureResponderEvent } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function Button({ title, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: disabled ? '#aaa' : pressed ? '#1d4ed8' : '#2563eb',
        alignItems: 'center',
      })}
    >
      <Text style={{ color: 'white', fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}
