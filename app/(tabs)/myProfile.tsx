import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, getUserEvents, getFollowCounts } from '@/mockdb/mockApis';
import { User } from '@/types/user';

export default function MyProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('hosting');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<any>(null);
  const [followCounts, setFollowCounts] = useState<{ followers: number; following: number }>({ followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const events = getUserEvents(user.id);
          const counts = getFollowCounts(user.id);
          setUserEvents(events);
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
  }, []);

  const getTabs = () => {
    if (currentUser?.isBusinessAccount) {
      return ['hosting', 'hosted'];
    }
    return ['going', 'went', 'hosting', 'hosted'];
  };

  const getTabLabel = (tab: string) => {
    const labels: { [key: string]: string } = {
      going: 'Going to',
      went: "Went to",
      hosting: 'Hosting',
      hosted: 'Hosted'
    };
    return labels[tab] || tab;
  };

  const renderEventList = (events: any[]) => {
    if (!events || events.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.icon }]}>
            No events to display
          </Text>
        </View>
      );
    }

    return events.map(event => (
      <View 
        key={event.id} 
        style={[styles.eventCard, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {event.title}
        </Text>
        <Text style={[styles.eventDate, { color: colors.icon }]}>
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text style={[styles.eventDescription, { color: colors.text }]}>
          {event.description}
        </Text>
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
    ));
  };

  if (isLoading || !currentUser || !userEvents) {
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
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            {currentUser.profilePictureUrl ? (
              <Image
                source={{ uri: currentUser.profilePictureUrl }}
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
                {currentUser.name}
              </Text>
              <Text style={[styles.bio, { color: colors.icon }]}>
                {currentUser.bio}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {followCounts.followers}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {followCounts.following}
              </Text>
              <Text style={[styles.statLabel, { color: colors.icon }]}>Following</Text>
            </View>
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
          {renderEventList(userEvents[activeTab] || [])}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
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
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
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