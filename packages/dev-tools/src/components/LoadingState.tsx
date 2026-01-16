import { FC } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

export const LoadingState: FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading stories...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMutedColor,
    fontSize: 13,
  },
});
