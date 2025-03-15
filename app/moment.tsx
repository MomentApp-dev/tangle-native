import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';
import { getUserByUsername } from '@/mockdb/mockApis';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getRelativeTime } from '@/utils/dateUtils';

export default function Moment() {
  // gets URL parameters -- includes relevant metadata
  const { title, description, host, metadata } = useLocalSearchParams();
  const parsedMetadata = metadata ? JSON.parse(metadata as string) : null;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { navigateToProfile } = useProfileNavigation();
  const [hostUser, setHostUser] = useState<User | null>(null);

  useEffect(() => {
    const loadHostUser = async () => {
      if (typeof host === 'string') {
        try {
          const username = host.replace('@', '').trim();
          const user = await getUserByUsername(username);
          setHostUser(user);
        } catch (error) {
          console.error('Error loading host user:', error);
        }
      }
    };
    loadHostUser();
  }, [host]);

  const handleBack = () => {
    router.back();
  };

  const handleProfilePress = () => {
    if (typeof host === 'string') {
      // Remove the '@' symbol if present and any spaces
      const username = host.replace('@', '').replace(/\s/g, '');
      navigateToProfile(username);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.icon }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Moment</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Host Profile Section */}
          <Pressable 
            style={styles.profileSection}
            onPress={handleProfilePress}
          >
            <Image 
              source={{ 
                uri: hostUser?.profilePictureUrl || 
                     `https://ui-avatars.com/api/?name=${encodeURIComponent(host as string)}&background=random` 
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.hostName, { color: colors.text }]}>
                {hostUser?.name || host}
              </Text>
              <Text style={[styles.hostHandle, { color: colors.icon }]}>
                @{typeof host === 'string' ? host.replace('@', '').toLowerCase().trim() : ''}
              </Text>
            </View>
          </Pressable>

          {/* Event Content */}
          <View style={styles.eventContent}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.timePosted, { color: colors.icon }]}>
              Posted {getRelativeTime(parsedMetadata?.createdAt)}
            </Text>
            <Text style={[styles.description, { color: colors.text }]}>{description}</Text>
          </View>

          {/* Event Metadata */}
          <View style={[styles.metadata, { borderColor: colors.icon }]}>
            <View style={styles.metadataRow}>
              <Ionicons name="calendar" size={18} color={colors.icon} />
              <View style={styles.metadataContent}>
                <Text style={[styles.metadataLabel, { color: colors.text }]}>Date & Time</Text>
                <Text style={[styles.metadataText, { color: colors.icon }]}>
                  {parsedMetadata?.date ? new Date(parsedMetadata.date).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'Date not specified'}
                </Text>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <Ionicons name="location" size={18} color={colors.icon} />
              <View style={styles.metadataContent}>
                <Text style={[styles.metadataLabel, { color: colors.text }]}>Location</Text>
                <Text style={[styles.metadataText, { color: colors.icon }]}>
                  {parsedMetadata?.location || 'Location not specified'}
                </Text>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <Ionicons name="people" size={18} color={colors.icon} />
              <View style={styles.metadataContent}>
                <Text style={[styles.metadataLabel, { color: colors.text }]}>Attendance</Text>
                <Text style={[styles.metadataText, { color: colors.icon }]}>
                  <Text style={{ color: colors.tint }}>{parsedMetadata?.going || 0}</Text> of {parsedMetadata?.maxCapacity || 0} spots filled
                  {parsedMetadata?.interested > 0 && ` · ${parsedMetadata.interested} interested`}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.tint,
                        width: `${Math.min(((parsedMetadata?.going || 0) / (parsedMetadata?.maxCapacity || 1)) * 100, 100)}%`
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Engagement Stats */}
          <View style={[styles.stats, { borderColor: colors.icon }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{parsedMetadata?.going || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Going</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{parsedMetadata?.interested || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Interested</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {Math.max((parsedMetadata?.maxCapacity || 0) - (parsedMetadata?.going || 0), 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Spots Left</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable style={[styles.mainActionButton, { backgroundColor: colors.tint }]}>
              <Text style={styles.mainActionText}>RSVP</Text>
            </Pressable>
            <View style={styles.secondaryActions}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="share-social-outline" size={24} color={colors.text} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="bookmark-outline" size={24} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  hostHandle: {
    fontSize: 15,
    opacity: 0.6,
  },
  eventContent: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  timePosted: {
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  metadata: {
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
    gap: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  metadataContent: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  metadataText: {
    fontSize: 15,
    opacity: 0.9,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
  actions: {
    gap: 16,
  },
  mainActionButton: {
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
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
  mainActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  iconButton: {
    padding: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#38444d20',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
}); 