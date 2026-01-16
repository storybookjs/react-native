import { FC } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { StorybookLogo } from '../icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  statusColor: string;
  pulseAnim: Animated.Value;
}

export const Header: FC<HeaderProps> = ({ statusColor, pulseAnim }) => (
  <View style={styles.header}>
    <StorybookLogo size={24} />
    <Text style={styles.title}>Storybook</Text>
    <View style={styles.headerStatus}>
      <Animated.View
        style={[styles.statusDot, { backgroundColor: statusColor, opacity: pulseAnim }]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.barBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textColor,
    flex: 1,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
