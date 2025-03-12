import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FeedEventData, MomentData } from '../types/feed';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { propsFlattener } from 'native-base/lib/typescript/hooks/useThemeProps/propsFlattener';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';

interface FeedItemProps {
  /** The event data to display */
  item: MomentData;
  /** Optional callback when the item is pressed */
  onPress: (item: MomentData) => void;
}

/**
 * Formats the host name by removing any prefixes
 * @param host - The raw host name from the data
 * @returns Cleaned host name for display
 */
function formatHostName(host: string): string {
  return host.replace('hosted by ', '');
}

export const UserContext = React.createContext({
  metadata: {
    createdAt: '',
    going: 0,
    interested: 0,
    notGoing: 0,
    views: 0,
  }
});

/**
 * FeedItem displays a single event in the feed with a Twitter-like design
 * Features:
 * - Generated avatars for other users
 * - Event details with title and description
 * - Interactive elements (RSVP, share, bookmark)
 */
export function FeedItem({ item, onPress }: FeedItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const hostName = formatHostName(item.host.username);
  const isHost = item.isHost;
  const [metadata, setMetadata] = useState(item.metadata);
  const { navigateToProfile } = useProfileNavigation();

  const handlePress = () => {
    onPress(item);
  };

  const handleProfilePress = () => {
    navigateToProfile(item.host.username.replace('@', ''));
  };

  /**
   * Renders the appropriate avatar based on the host
   * - Custom mustache icon for Cory
   * - Generated avatar for other users
   */
  const renderAvatar = () => {
    return (
      <Image 
        source={{ uri: `https://ui-avatars.com/api/?name=${hostName}&background=random` }}
        style={styles.avatar}
      />
    );
  };

  return (
    <UserContext.Provider value={{ metadata: metadata }}>
      <Pressable 
        style={[styles.container, { backgroundColor: colors.background }]} 
        onPress={handlePress}
      >
        {/* Avatar Section */}
        <Pressable onPress={handleProfilePress} style={styles.avatarContainer}>
          {renderAvatar()}
        </Pressable>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Host Information */}
          <View style={styles.header}>
            <Pressable onPress={handleProfilePress}>
              <Text style={[styles.hostName, { color: colors.text }]} numberOfLines={1}>
                {hostName}
              </Text>
            </Pressable>
            <Ionicons 
              name="checkmark-circle" 
              size={16} 
              color="#1D9BF0" 
              style={styles.verifiedBadge}
            />
            {
              isHost && <Text style={[styles.eventLabel, { color: colors.icon }]}>
                is hosting an event
              </Text>
            }
            {
              !isHost && <Text style={[styles.eventLabel, { color: colors.icon }]}>
              is attending an event
            </Text>
            }
          </View>

          {/* Event Information */}
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          
          {item.description && (
            <Text style={[styles.description, { color: colors.text }]}>
              {item.description}
            </Text>
          )}

          {/* Interactive Elements */}
          <View style={styles.actions}>
            <Pressable style={styles.actionItem}>
              <View style={[styles.rsvpButton, { backgroundColor: colors.text }]}>
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={colors.background} 
                  style={styles.rsvpIcon}
                />
                <Text style={[styles.rsvpText, { color: colors.background }]}>
                  RSVP
                </Text>
              </View>
            </Pressable>
            <View style={styles.actionItem}>
              <Ionicons name="share-social-outline" size={20} color={colors.icon} />
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="bookmark-outline" size={20} color={colors.icon} />
            </View>
          </View>
        </View>
      </Pressable>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Main container layout
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38444d',
  },
  content: {
    flex: 1,
  },

  // Avatar configuration
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  mustacheContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header section styling
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hostName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    marginHorizontal: 4,
  },
  eventLabel: {
    fontSize: 15,
  },

  // Event content styling
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Interactive elements styling
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
    paddingRight: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  rsvpIcon: {
    marginRight: 6,
  },
  rsvpText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 