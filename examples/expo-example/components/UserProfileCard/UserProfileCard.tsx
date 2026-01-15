import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export interface UserProfileCardProps {
  /** User's display name */
  name: string;
  /** User's email address */
  email?: string;
  /** User's bio or description */
  bio?: string;
  /** User's role or title */
  role?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Whether the user is verified */
  verified?: boolean;
  /** Whether the user is online */
  online?: boolean;
  /** Callback when the card is pressed */
  onPress?: () => void;
  /** Callback when the follow button is pressed */
  onFollowPress?: () => void;
  /** Whether following this user */
  isFollowing?: boolean;
  /** Number of followers */
  followers?: number;
  /** Number of following */
  following?: number;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  email,
  bio,
  role,
  avatarUrl,
  verified = false,
  online = false,
  onPress,
  onFollowPress,
  isFollowing = false,
  followers = 0,
  following = 0,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          {online && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>
          {role && <Text style={styles.role}>{role}</Text>}
          {email && (
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
          )}
        </View>
      </View>

      {bio && (
        <Text style={styles.bio} numberOfLines={3}>
          {bio}
        </Text>
      )}

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{followers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{following.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {onFollowPress && (
        <Pressable
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={onFollowPress}
        >
          <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  verifiedBadge: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
  role: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    marginBottom: 12,
  },
  stat: {
    marginRight: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  followingButtonText: {
    color: '#6b7280',
  },
});
