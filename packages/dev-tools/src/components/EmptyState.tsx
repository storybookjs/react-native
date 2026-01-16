import { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SearchIcon } from '../icons';
import { colors } from '../theme/colors';

interface EmptyStateProps {
  message: string;
  showIcon?: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({ message, showIcon }) => (
  <View style={styles.emptyContainer}>
    {showIcon && <SearchIcon color={colors.textMutedColor} />}
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: colors.textMutedColor,
    fontSize: 13,
  },
});
