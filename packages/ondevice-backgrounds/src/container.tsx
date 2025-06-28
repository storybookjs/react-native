import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { PARAM_KEY } from './constants';

import { useGlobals } from 'storybook/internal/preview-api';

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  const [globals] = useGlobals();
  const background = globals[PARAM_KEY]?.value;

  return (
    <View
      testID="addon-backgrounds-container"
      style={[styles.container, background && { backgroundColor: background }]}
    >
      {children}
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
});
