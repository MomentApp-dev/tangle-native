import { View, Text, StyleSheet, ScrollView, Image, Pressable, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';
import { getUserByUsername } from '@/mockdb/mockApis';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';

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
            <Text style={[styles.description, { color: colors.text }]}>{description}</Text>
          </View>

          {/* Event Metadata */}
          <View style={[styles.metadata, { borderColor: colors.icon }]}>
            <Text style={[styles.metadataText, { color: colors.icon }]}>
              {new Date(parsedMetadata?.createdAt).toLocaleString()}
            </Text>
          </View>

          {/* Engagement Stats */}
          <View style={[styles.stats, { borderColor: colors.icon }]}>
            <Text style={[styles.statItem, { color: colors.text }]}>
              <Text style={styles.statNumber}>{ parsedMetadata?.going || 0 }</Text> Going
            </Text>
            <Text style={[styles.statItem, { color: colors.text }]}>
              <Text style={styles.statNumber}>{ parsedMetadata?.interested || 0 }</Text> Interested
            </Text>
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
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  metadata: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  metadataText: {
    fontSize: 15,
    opacity: 0.8,
  },
  stats: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
    gap: 24,
  },
  statItem: {
    fontSize: 15,
  },
  statNumber: {
    fontWeight: 'bold',
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
}); 