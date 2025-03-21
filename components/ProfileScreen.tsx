import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getUserMoments, getFollowCounts, getUser } from '@/mockdb/mockApis';
import { User } from '@/types/user';
import { router } from 'expo-router';
import { Moment } from '@/types/moment';

interface ProfileScreenProps {
  user: User;
  isOwnProfile?: boolean;
}

export default function ProfileScreen({ user, isOwnProfile = false }: ProfileScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('hosting');
  const [userMoments, setUserMoments] = useState<any>(null);
  const [followCounts, setFollowCounts] = useState<{ followers: number; following: number }>({ followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          const moments = getUserMoments(user.id);
          const counts = getFollowCounts(user.id);
          setUserMoments(moments);
          setFollowCounts(counts);
          setActiveTab(user.isBusinessAccount ? 'hosting' : 'going');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const getTabs = () => {
    if (user?.isBusinessAccount) {
      return ['hosting', 'hosted'];
    }
    return ['going', 'considering', 'went', 'hosting', 'hosted'];
  };

  const getTabLabel = (tab: string) => {
    const labels: { [key: string]: string } = {
      going: 'Attending',
      considering: 'Considering',
      went: "Attended",
      hosting: 'Hosting',
      hosted: 'Hosted'
    };
    return labels[tab] || tab;
  };

  const renderMomentList = (moments: Moment[]) => {
    if (!moments || moments.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.icon }]}>
            No moments to display
          </Text>
        </View>
      );
    }

    return moments.map(moment => {
      const host = getUser(moment.hostId)!;
      
      return (
        <Pressable 
          key={moment.id} 
          style={[styles.eventCard, { backgroundColor: colors.background }]}
          onPress={() => {
            router.push({
              pathname: '/moment' as const,
              params: {
                title: moment.title,
                description: moment.description || '',
                host: `@${host.username}`,
                createdAt: moment.createdAt,
              },
            });
          }}
        >
          <View style={styles.eventHeader}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {moment.title}
            </Text>
            <Pressable style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
            </Pressable>
          </View>
          <Text style={[styles.eventDate, { color: colors.icon }]}>
            {new Date(moment.date).toLocaleDateString()}
          </Text>
          <Text style={[styles.eventDescription, { color: colors.text }]}>
            {moment.description}
          </Text>
        </Pressable>
      );
    });
  };

  if (isLoading || !user || !userMoments) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingState}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {!isOwnProfile && (
        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>
      )}
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            {user.profilePictureUrl ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.profileImageContainer}
              />
            ) : (
              <View style={[styles.profileImageContainer, { backgroundColor: colors.icon }]}>
                <Ionicons 
                  name="cafe" 
                  size={40} 
                  color={colors.background}
                />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>
                {user.name}
              </Text>
              <Text style={[styles.bio, { color: colors.icon }]}>
                {user.bio}
              </Text>
              {!isOwnProfile && (
                <Pressable 
                  style={[styles.followButton, { backgroundColor: colors.text }]}
                  onPress={() => {/* TODO: Implement follow/unfollow */}}
                >
                  <Text style={[styles.followButtonText, { color: colors.background }]}>
                    Follow
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Pressable 
              style={styles.statItem}
              onPress={() => router.push(`/(profile)/${user.username}/followers`)}
            >
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {followCounts.followers}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Followers</Text>
            </Pressable>
            <Pressable 
              style={styles.statItem}
              onPress={() => router.push(`/(profile)/${user.username}/following`)}
            >
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {followCounts.following}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Following</Text>
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: '#38444d' }]}>
          {getTabs().map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { borderBottomColor: '#1D9BF0' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? '#1D9BF0' : colors.icon }
              ]}>
                {getTabLabel(tab)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {renderMomentList(userMoments[activeTab] || [])}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  header: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    fontSize: 15,
    marginBottom: 16,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    marginRight: 24,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 2,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  eventsContainer: {
    padding: 16,
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#38444d',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  menuButton: {
    padding: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
}); 