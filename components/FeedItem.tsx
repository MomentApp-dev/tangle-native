import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';
import { FeedItem as FeedItemType } from '@/types/feedItem';
import { getUser, getMoment, getRSVPCount } from '@/mockdb/mockApis';
import { User } from '@/types/user';
import { Moment } from '@/types/moment';
import { getRelativeTime } from '@/utils/dateUtils';

const getDaysUntil = (date: string) => {
  const eventDate = new Date(date);
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return 'Past';
  return `in ${diffDays} days`;
};

interface FeedItemProps {
  /** The feed item data to display */
  item: FeedItemType;
  /** Optional callback when the item is pressed */
  onPress: (item: FeedItemType) => void;
}

/**
 * FeedItem displays a single moment in the feed with a Twitter-like design
 * Features:
 * - Generated avatars for users
 * - Moment details with title and description
 * - Interactive elements
 */
export function FeedItem({ item, onPress }: FeedItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { navigateToProfile } = useProfileNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const momentData = getMoment(item.momentId);
        const userData = getUser(item.userId);

        if (!momentData || !userData) {
          throw new Error('Failed to load moment or user data');
        }

        setMoment(momentData);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [item.momentId, item.userId]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.tint} />
      </View>
    );
  }

  if (error || !moment || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || 'Failed to load content'}
        </Text>
      </View>
    );
  }

  const handlePress = () => {
    onPress(item);
  };

  const handleProfilePress = () => {
    navigateToProfile(user.username);
  };

  /**
   * Renders the appropriate avatar based on the user
   * - Uses the user's profile picture if available
   * - Falls back to a generated avatar if no profile picture is available
   */
  const renderAvatar = () => {
    return (
      <Image 
        source={{ 
          uri: user.profilePictureUrl || 
               `https://ui-avatars.com/api/?name=${user.username}&background=random` 
        }}
        style={styles.avatar}
      />
    );
  };

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: colors.background }]} 
      onPress={handlePress}
    >
      {/* Avatar Section */}
      <Pressable onPress={handleProfilePress} style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          {renderAvatar()}
        </View>
      </Pressable>

      {/* Content Section */}
      <View style={styles.content}>
        {/* User Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Text style={[
              styles.dateText,
              { color: colorScheme === 'dark' ? '#9CA3AF' : '#71767B' }
            ]}>
              {getRelativeTime(item.createdAt)}
            </Text>
            <View style={styles.nameRow}>
              <Pressable onPress={handleProfilePress}>
                <Text style={[
                  styles.hostName,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#4B5563' }
                ]} numberOfLines={1}>
                  {user.name}
                </Text>
              </Pressable>
              {user.isBusinessAccount && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={14} 
                  color="#1D9BF0" 
                  style={styles.verifiedBadge}
                />
              )}
              <Text style={[
                styles.eventLabel,
                { color: colorScheme === 'dark' ? '#9CA3AF' : '#71767B' }
              ]} numberOfLines={1}>
                {item.type === 'created' 
                  ? 'is hosting'
                  : item.rsvpStatus === 'maybe'
                  ? 'is considering attending'
                  : 'is attending'}
              </Text>
            </View>
          </View>
          <View style={styles.menuSection}>
            <Pressable style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
            </Pressable>
          </View>
        </View>

        {/* Moment Card */}
        <View style={[
          styles.momentCard, 
          { 
            backgroundColor: colorScheme === 'dark' ? '#1c1c1c' : '#ffffff',
            borderColor: colorScheme === 'dark' ? '#383838' : '#e1e1e1',
          }
        ]}>
          <View style={styles.momentHeader}>
            <View style={[
              styles.momentIcon,
              {
                backgroundColor: colorScheme === 'dark' ? '#1D9BF015' : '#1D9BF010',
                borderColor: colorScheme === 'dark' ? '#1D9BF030' : '#1D9BF020',
              }
            ]}>
              <View style={styles.calendarIcon}>
                <Ionicons 
                  name="calendar-clear" 
                  size={16} 
                  color="#1D9BF0"
                  style={styles.baseIcon}
                />
                <View style={[
                  styles.dateContainer,
                  { backgroundColor: colorScheme === 'dark' ? '#1c1c1c' : '#ffffff' }
                ]}>
                  <Ionicons 
                    name="time-outline" 
                    size={10} 
                    color="#1D9BF0"
                    style={styles.timeIcon}
                  />
                </View>
              </View>
            </View>
            <View style={styles.momentContent}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                {moment.title}
              </Text>
              
              {moment.description && (
                <Text style={[styles.description, { color: colorScheme === 'dark' ? '#A8A8A8' : '#666666' }]} numberOfLines={2}>
                  {moment.description}
                </Text>
              )}
              
              <View style={styles.momentMetadata}>
                <Text style={[styles.metadataText, { color: colorScheme === 'dark' ? '#9CA3AF' : '#71767B' }]} numberOfLines={1}>
                  <Ionicons name="time" size={12} color={colorScheme === 'dark' ? '#9CA3AF' : '#71767B'} />
                  {' '}{getDaysUntil(moment.date)}
                  {'  ·  '}
                  <Ionicons name="location" size={12} color={colorScheme === 'dark' ? '#9CA3AF' : '#71767B'} />
                  {' '}{moment.location}
                  {'  ·  '}
                  <Ionicons name="people" size={12} color={colorScheme === 'dark' ? '#9CA3AF' : '#71767B'} />
                  {' '}{getRSVPCount(moment.id)} going
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#38444d20',
  },
  content: {
    flex: 1,
    marginRight: 0,
  },
  avatarContainer: {
    marginRight: 8,
    height: 36,
    width: 36,
    marginTop: 2,
  },
  avatarWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  userSection: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 38,
  },
  userInfo: {
    flex: 1,
    marginRight: 2,
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  dateText: {
    fontSize: 13,
    opacity: 0.8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  hostName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: '#4B5563',
  },
  verifiedBadge: {
    marginLeft: 4,
    marginRight: 4,
  },
  eventLabel: {
    fontSize: 15,
    color: '#71767B',
    letterSpacing: -0.2,
    opacity: 0.9,
    marginLeft: 4,
  },
  menuSection: {
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: 4,
    marginTop: -2,
    marginRight: -2,
  },
  momentCard: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 0,
    marginLeft: -44,
    marginRight: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  momentIcon: {
    marginRight: 0,
    marginTop: 2,
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  baseIcon: {
    opacity: 0.9,
  },
  dateContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 8,
    padding: 2,
  },
  timeIcon: {
    opacity: 0.9,
  },
  momentContent: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
  momentMetadata: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 13,
    opacity: 0.8,
    flex: 1,
  },
}); 